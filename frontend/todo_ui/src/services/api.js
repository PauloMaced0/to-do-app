import axios from "axios";

const API_BASE_URL = "http://localhost:8000"; // Replace with your actual backend URL

// Fetch user profile
export const getUserProfile = async (userId, idToken) => {
  const response = await axios.get(`${API_BASE_URL}/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
  });

  return response.data;
};

// Update user profile
export const updateUserProfile = async (userId, data, idToken) => {
  const response = await axios.put(`${API_BASE_URL}/users/${userId}`, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
  });
  return response.data;
};
