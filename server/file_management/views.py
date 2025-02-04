from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from .serializers import *
from rest_framework import status
from .validations import *
from rest_framework.parsers import MultiPartParser, FormParser
import os
import cloudinary.uploader
from cloudinary import api
from cloudinary.exceptions import NotFound
from Crypto.Cipher import AES
from Crypto.Random import get_random_bytes
import base64
from django.http import FileResponse
import io
import uuid
from django.utils import timezone
import mimetypes
from django.db.models import Sum
from django.shortcuts import get_object_or_404
from .models import *
from django.db.models import Count
from django.db.models.functions import TruncMonth

# (10 MB)
FILE_SIZE_LIMIT = 10 * 1024 * 1024  # 10 MB


@api_view(["GET"])
def search_files(request):
    query = request.GET.get("q", "")  # Get the search query from the request

    if query:
        # Filter files by file_name
        files = File.objects.filter(file_name__icontains=query)
    else:
        files = File.objects.none()  # Return no files if no query is provided

    # Manually create a response structure without the extra 'model' and 'pk' fields
    files_data = [
        {
            "id": file.id,
            "file_name": file.file_name,
            "file_url": file.file_url,
            "public_id": file.public_id,
            "upload_date": file.upload_date,
            "file_type": file.file_type,
            "file_size": file.file_size,
        }
        for file in files
    ]

    # Return the response with a status code of 200
    return Response({"files": files_data}, status=200)


# GET ALL FILES FOR ADMIN
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_files(request):
    try:
        # Fetch all files and annotate with the count of each file type
        file_counts = (
            File.objects.values("file_type")
            .annotate(count=Count("file_type"))
            .order_by("-count")  # Sort by count in descending order
        )[:5]

        # Prepare the response format
        result = {file["file_type"]: file["count"] for file in file_counts}

        return Response(result, status=200)
    except Exception as e:
        return Response({"detail": str(e)}, status=500)


@api_view(["GET"])
@permission_classes([AllowAny])
def count_upload(request):
    try:
        # Group by month and count the number of uploads for each month
        monthly_uploads = (
            File.objects.annotate(month=TruncMonth("upload_date"))
            .values("month")
            .annotate(count=Count("id"))
            .order_by("month")
        )

        # Format the result as a list of dictionaries
        result = [
            {"month": entry["month"], "total_uploads": entry["count"]}
            for entry in monthly_uploads
        ]

        return Response(result, status=200)
    except Exception as e:
        return Response({"error": str(e)}, status=500)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def count_file(request):
    try:
        print("Attempting to count files in the database.")  # Debug line
        file_count = File.objects.aggregate(count=Count("id"))["count"]
        print(f"File count: {file_count}")  # Debug line
        return Response({"file_count": file_count}, status=200)
    except Exception as e:
        print(f"Unexpected error: {e}")
        return Response({"error": "An unexpected error occurred."}, status=500)


# Get the total file size upload the user has
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def get_tot_size(request):
    user = request.user
    total_size = (
        File.objects.filter(user=user).aggregate(Sum("file_size"))["file_size__sum"]
        or 0
    )
    return Response({"total_size": total_size})


# Encryption function for AES
def encrypt_file(file_data):
    key = get_random_bytes(32)  # AES-256 requires a 32-byte key
    cipher = AES.new(key, AES.MODE_GCM)
    nonce = cipher.nonce
    ciphertext, tag = cipher.encrypt_and_digest(file_data)
    return key, nonce, ciphertext, tag


# Decryption function for AES
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def decrypt_file(request, pk):
    try:
        # Retrive the file instance
        file_instance = File.objects.get(pk=pk)
        # Extract the encryption components
        key = base64.b64decode(file_instance.key)
        nonce = base64.b64decode(file_instance.nonce)
        ciphertext = base64.b64decode(file_instance.ciphertext)
        tag = base64.b64decode(file_instance.tag)

        # Create a new AES cipher object for decrpytion
        cipher = AES.new(key, AES.MODE_GCM, nonce=nonce)
        decrypted_data = cipher.decrypt_and_verify(ciphertext, tag)

        # Determine the correct MIME type using the file_type field
        mime_type = mimetypes.types_map.get(
            f".{file_instance.file_type}", "application/octet-stream"
        )
        # Prepare the decrypted data for download
        response = FileResponse(io.BytesIO(decrypted_data), content_type=mime_type)
        response["Content-Disposition"] = (
            f'attachment; filename="{file_instance.file_name + "." + file_instance.file_type}"'
        )
        print(file_instance.file_name)
        return response
    except File.DoesNotExist:
        return Response({"detail": "File not found."}, status=status.HTTP_404_NOT_FOUND)
    except ValueError as e:
        return Response(
            {"detail": f"Decryption failed: {str(e)}"},
            status=status.HTTP_400_BAD_REQUEST,
        )
    except Exception as e:
        return Response(
            {"detail": f"An error occurred: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def file_list_view(request):
    files = File.objects.filter(user=request.user)
    serializer = FileSerializer(files, many=True)
    return Response(serializer.data)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def file_upload_view(request):
    files = request.FILES.getlist("files")

    if not files:
        return Response(
            {"error": "No files uploaded."}, status=status.HTTP_400_BAD_REQUEST
        )

    responses = []
    for file in files:
        # Check file size
        if file.size > FILE_SIZE_LIMIT:
            return Response(
                {
                    "error": f"File '{file.name}' is too large. Maximum allowed size is 10 MB."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Read and encrypt file content
        file_data = file.read()

        # Encrypt the file
        key, nonce, ciphertext, tag = encrypt_file(file_data)
        cloudinary_folder = f"user_{request.user.id}"

        original_filename, _ = os.path.splitext(file.name)
        file_extension = os.path.splitext(file.name)[1].lower().replace(".", "")
        upload_options = {
            "folder": cloudinary_folder,
            "resource_type": "raw",
        }

        try:
            # Upload encrypted file to Cloudinary
            upload_result = cloudinary.uploader.upload(ciphertext, **upload_options)
            cloudinary_url = upload_result.get("secure_url")
            public_id = upload_result.get("public_id")

            # Encode encryption components in Base64
            encoded_key = base64.b64encode(key).decode()
            encoded_nonce = base64.b64encode(nonce).decode()
            encoded_ciphertext = base64.b64encode(ciphertext).decode()
            encoded_tag = base64.b64encode(tag).decode()

            # Prepare data for serializer
            serializer_data = {
                "file_name": original_filename,
                "file_url": cloudinary_url,
                "public_id": public_id,
                "user": request.user.id,
                "key": encoded_key,
                "nonce": encoded_nonce,
                "ciphertext": encoded_ciphertext,
                "tag": encoded_tag,
                "file_type": file_extension,
                "file_size": file.size,
            }

            # Create serializer
            serializer = FileSerializer(data=serializer_data)

            if serializer.is_valid():
                serializer.save()
                responses.append(serializer.data)
            else:
                print("Serializer errors:", serializer.errors)  # Log errors if any
        except Exception as e:
            print(f"Failed to upload {file.name} to Cloudinary: {e}")
            return Response(
                {"error": "Failed to upload files."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    if responses:
        return Response(responses, status=status.HTTP_201_CREATED)

    return Response(
        {"error": "Files were invalid."}, status=status.HTTP_400_BAD_REQUEST
    )


def check_resource_exists(public_id):
    try:
        # Attempt to retrieve the resource information from Cloudinary
        resource_info = api.resource(public_id, resource_type="raw")
        return resource_info
    except NotFound:
        # If the resource does not exist, print a message and return None
        print("Resource not found.")
        return None
    except Exception as e:
        # Handle other potential exceptions and log the error
        print(f"Error checking resource: {str(e)}")
        return None


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def file_delete_view(request, pk):
    try:
        # Fetch the file instance
        file_instance = File.objects.get(pk=pk)

        # Check if the user is the owner of the file
        if file_instance.user != request.user:
            return Response(
                {"detail": "You do not have permission to delete this file."},
                status=status.HTTP_403_FORBIDDEN,
            )

        public_id = file_instance.public_id

        # Check if the resource exists in Cloudinary
        resource_info = check_resource_exists(public_id)
        if resource_info is None:
            return Response(
                {"detail": "File not found in Cloudinary."},
                status=status.HTTP_404_NOT_FOUND,
            )

        # Attempt to delete the resource from Cloudinary
        try:
            response = cloudinary.uploader.destroy(
                file_instance.public_id, resource_type="raw"
            )

            if response.get("result") == "ok":
                # File deleted successfully from Cloudinary
                # Now delete the file instance from the database
                file_instance.delete()
                return Response(status=status.HTTP_204_NO_CONTENT)
            else:
                # Handle error response from Cloudinary
                return Response(
                    {"detail": f"Failed to delete file from Cloudinary: {response}"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )
        except Exception as e:
            return Response(
                {"detail": f"Failed to delete file from Cloudinary: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
    except File.DoesNotExist:
        return Response({"detail": "File not found."}, status=status.HTTP_404_NOT_FOUND)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def share_file(request):
    file_id = request.data.get("file_id")
    username = request.data.get("username")
    file = get_object_or_404(File, id=file_id, user=request.user)

    # Check if the user is trying to share the file with themselves
    if username == request.user.username:
        return Response(
            {"error": "You cannot share a file with yourself."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    # Check if the user with the given username exists
    if not User.objects.filter(username=username).exists():
        return Response(
            {"error": "The specified user does not exist."},
            status=status.HTTP_404_NOT_FOUND,
        )

    # If the user exists, retrieve the User object
    shared_with = User.objects.get(username=username)

    shared_file, created = SharedFile.objects.get_or_create(
        file=file, shared_with=shared_with
    )

    return Response(
        {
            "message": (
                "File shared successfully."
                if created
                else "File already shared with this user."
            ),
            "shared_file_id": shared_file.id,
        },
        status=status.HTTP_201_CREATED,
    )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def list_shared_files(request):
    shared_files = SharedFile.objects.filter(shared_with=request.user)
    shared_files_data = [
        {
            "id": sf.id,
            "file_name": sf.file.file_name,
            "file_type": sf.file.file_type,
            "shared_date": sf.shared_date,
            "file_id": sf.file_id,
            "username": sf.file.user.username,
        }
        for sf in shared_files
    ]

    return Response(shared_files_data, status=status.HTTP_200_OK)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def list_files_shared_by_user(request):
    shared_files = SharedFile.objects.filter(file__user=request.user)
    shared_files_data = {}

    for sf in shared_files:
        file_id = sf.file.id
        if file_id not in shared_files_data:
            shared_files_data[file_id] = {
                "id": file_id,
                "file_name": sf.file.file_name,
                "file_type": sf.file.file_type,
                "shared_date": sf.shared_date,
                "shared_with": [],
            }
        shared_files_data[file_id]["shared_with"].append(
            {
                "user_id": sf.shared_with.id,
                "username": sf.shared_with.username,
            }
        )

    return Response(list(shared_files_data.values()), status=status.HTTP_200_OK)


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_shared_file(request, shared_file_id):
    try:
        shared_file = SharedFile.objects.get(id=shared_file_id)
    except SharedFile.DoesNotExist:
        return Response(
            {
                "error": "Shared file not found or you do not have permission to delete it."
            },
            status=status.HTTP_404_NOT_FOUND,
        )

    shared_file.delete()
    return Response(
        {"message": "Shared file entry deleted successfully."},
        status=status.HTTP_204_NO_CONTENT,
    )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_link_share(request):
    file_id = request.POST.get("file_id")
    expiration_date = request.POST.get("expiration_date")

    # Fetch the file, ensuring it belongs to the authenticated user
    file = get_object_or_404(File, id=file_id, user=request.user)

    # Parse and validate expiration_date, if provided
    expiration = None
    if expiration_date:
        try:
            expiration = timezone.datetime.strptime(expiration_date, "%Y-%m-%d").date()
        except ValueError:
            return Response(
                {"error": "Invalid date format. Use YYYY-MM-DD."},
                status=status.HTTP_400_BAD_REQUEST,
            )

    # Create a unique share link
    unique_link = f"share-{uuid.uuid4()}"

    # Create the LinkShare instance
    link_share = LinkShare.objects.create(
        file=file,
        share_link=unique_link,
        expiration_date=expiration,
    )

    # Return a success response with the link share details
    return Response(
        {
            "message": "Link share created successfully.",
            "link_share_id": link_share.id,
            "share_link": link_share.share_link,
        },
        status=status.HTTP_201_CREATED,
    )


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def remove_shared_file(request, pk):
    try:
        # Retrieve the SharedFile object
        shared_file = get_object_or_404(SharedFile, file_id=pk)
        # Check if the authenticated user is the owner of the file
        if shared_file.file.user != request.user:
            return Response(
                {"error": "You do not have permission to remove access to this file."},
                status=status.HTTP_403_FORBIDDEN,
            )

        # Delete the SharedFile entry
        shared_file.delete()

        return Response(
            {"message": "Access to the file has been removed successfully."},
            status=status.HTTP_200_OK,
        )
    except AttributeError as e:
        # Handle missing file or file.user attributes
        return Response(
            {"error": f"Attribute error: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
    except Exception as e:
        # General exception for any other unexpected errors
        return Response(
            {"error": f"Unexpected error: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
