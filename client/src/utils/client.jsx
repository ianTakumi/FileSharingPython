import axios from "axios";
import { getToken, setToken } from "./Helpers";

const isDevelopment = process.env.NODE_ENV === "development";
const myBaseUrl = isDevelopment
  ? `${process.env.REACT_APP_API_LINK}`
  : `${process.env.REACT_APP_BASE_URL_DEPLOY}`;
const client = axios.create({
  baseURL: `${myBaseUrl}/`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Function to refresh the access token
const refreshAccessToken = async () => {
  const { refreshToken } = getToken() || {};
  console.log(refreshToken);
  if (!refreshToken) {
    throw new Error("No refresh token available.");
  }
  if (refreshToken) {
    const cleanedToken = refreshToken.replace(/^["']|["']$/g, "");
    try {
      const response = await axios.post(`/token/refresh/`, {
        refresh: cleanedToken,
      });

      // Save new tokens
      const { access } = response.data; // Adjust based on your API response structure
      setToken({ access }); // Update the token in local storage or your state management
      return access;
    } catch (error) {
      console.error("Failed to refresh token:", error);
      throw error; // Rethrow error to handle in the request interceptor
    }
  }
};

// Add a request interceptor to attach the access token to headers
client.interceptors.request.use(
  (config) => {
    const { accessToken } = getToken() || {};
    if (accessToken) {
      const cleanedToken = accessToken.replace(/^["']|["']$/g, "");
      config.headers["Authorization"] = `Bearer ${cleanedToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Only attempt token refresh if the error is specifically due to expiration
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Call the token refresh function
        const newAccessToken = await refreshAccessToken();

        // Set the new token in headers
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

        // Retry the original request with the new token
        return client(originalRequest);
      } catch (refreshError) {
        console.error("Failed to refresh token", refreshError);
        // Optional: Redirect to login or logout on token refresh failure
      }
    }

    // If the error was not due to token expiration or refresh failed
    return Promise.reject(error);
  }
);

export default client;
