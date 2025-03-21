// src/services/flowService.ts
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';

// Get all flows for the authenticated user
export const getFlows = async () => {
  const accessToken = localStorage.getItem("access-token");
  const client = localStorage.getItem("client");
  const uid = localStorage.getItem("uid");

  const response = await axios.get(`${API_BASE_URL}/flows`, {
    headers: { 'access-token': accessToken, client, uid },
    withCredentials: true,
  });
  return response.data;
};

// Create a new flow
export const createFlow = async (title: string, content: object = {}) => {
  const accessToken = localStorage.getItem("access-token");
  const client = localStorage.getItem("client");
  const uid = localStorage.getItem("uid");

  const response = await axios.post(
    `${API_BASE_URL}/flows`,
    {
      flow: {
        title,
        content,
        published: false,
        metadata: {},
      },
    },
    {
      headers: { 'access-token': accessToken, client, uid },
      withCredentials: true,
    }
  );
  return response.data;
};
