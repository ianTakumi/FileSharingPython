import React, { useState, useEffect } from "react";
import client from "../../utils/client";
import { notifyError, formatDate } from "../../utils/Helpers";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Menu, MenuItem, IconButton } from "@mui/material";
import ContactModal from "../../components/Admin/Modal/ContactModal";

const Contact = () => {
  const [contacts, setContacts] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedContact, setSelectedContact] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchContacts = async () => {
    await client
      .get("/contact-list/")
      .then((response) => {
        setContacts(response.data);
      })
      .catch(() => {
        notifyError("Error fetching contacts");
      });
  };

  const openModal = (contact = null) => {
    setSelectedContact(contact);
    console.log("Opening modal with contact:", contact);
    setIsModalOpen(true); // Open modal after setting the contact
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedContact(null);
  };

  const handleMenuClick = (event, contact) => {
    setAnchorEl(event.currentTarget);
    setSelectedContact(contact);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    openModal(selectedContact);
    handleMenuClose();
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  return (
    <>
      <div className="px-3 mt-8">
        <h1 className="font-bold font-serif text-2xl">List of Contacts</h1>
        <div className="mt-4 bg-white p-4 shadow-md rounded-lg">
          <table className="min-w-full bg-white border-collapse">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b text-left">ID</th>
                <th className="py-2 px-4 border-b text-left">Name</th>
                <th className="py-2 px-4 border-b text-left">Email</th>
                <th className="py-2 px-4 border-b text-left">Message</th>
                <th className="py-2 px-4 border-b text-left">Status</th>
                <th className="py-2 px-4 border-b text-left">Sent at</th>
                <th className="py-2 px-4 border-b text-left">Updated at</th>
                <th className="py-2 px-4 border-b text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((contact) => (
                <tr key={contact.id} className="hover:bg-slate-50">
                  <td className="py-2 px-4 border-b">{contact.id}</td>
                  <td className="py-2 px-4 border-b">{contact.name}</td>
                  <td className="py-2 px-4 border-b">{contact.email}</td>
                  <td className="py-2 px-4 border-b">{contact.message}</td>
                  <td className="py-2 px-4 border- capitalize">
                    {contact.status}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {formatDate(contact.created_at)}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {formatDate(contact.updated_at)}
                  </td>
                  <td className="py-2 px-4 border-b">
                    <IconButton
                      onClick={(event) => handleMenuClick(event, contact)}
                      className="p-1 rounded-full bg-transparent text-gray-500 hover:text-black transition duration-200 ease-in-out"
                    >
                      <MoreVertIcon />
                    </IconButton>
                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={handleMenuClose}
                      PaperProps={{
                        style: {
                          borderRadius: "4px", // Slight rounding
                          boxShadow: "0px 1px 4px rgba(0, 0, 0, 0.05)", // Light shadow for subtle effect
                        },
                      }}
                    >
                      <MenuItem onClick={handleEdit}>
                        <EditOutlinedIcon className="mr-2" /> Edit
                      </MenuItem>
                    </Menu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Render ContactModal and pass selectedContact and onClose props */}
      {isModalOpen && (
        <ContactModal
          contact={selectedContact}
          onClose={closeModal}
          refresh={fetchContacts}
        />
      )}
    </>
  );
};

export default Contact;
