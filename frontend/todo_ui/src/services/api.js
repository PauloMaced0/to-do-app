import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;

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

export const getUserTaskStats = async (userId, idToken) => {
  const response = await axios.get(`${API_BASE_URL}/tasks/stats/${userId}`, {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
  });

  return response.data;
};

export const setUserAccount = async (idToken, userPayload) => {
  const response = await axios.post(`${API_BASE_URL}/users`, userPayload, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
  });

  return response.data;
}

export const getUserTasks = async (userId, filterBy, sortBy, idToken) => {
  const response = await axios.get(`${API_BASE_URL}/tasks?user_id=${userId}&sort_by=${sortBy}&filter_by=${filterBy}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
  });

  return response.data;
}

export const updateUserTask = async (taskId, task, idToken) => {
  const response = await axios.put(`${API_BASE_URL}/tasks/${taskId}`, task, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
  });

  return response.data;
}

export const createUserTask = async (task, idToken) => {
  const response = await axios.post(`${API_BASE_URL}/tasks`, task, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
  });

  return response.data;
}

export const deleteUserTask = async (taskId, idToken) => {
  const response = await axios.delete(`${API_BASE_URL}/tasks/${taskId}`, {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  });

  return response.data;
}

export const completeUserTask = async (taskId, taskPayload, idToken) => {
  const response = await axios.put(`${API_BASE_URL}/tasks/${taskId}`, taskPayload, {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  });

  return response.data;
}

