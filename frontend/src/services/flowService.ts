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
      title,
      content, // flattened data structure
    },
    {
      headers: { 'access-token': accessToken, client, uid },
      withCredentials: true,
    }
  );
  return response.data;
};

export const updateFlow = async (uid: string, content: object, updatePublished: boolean = false) => {
  const accessToken = localStorage.getItem("access-token");
  const client = localStorage.getItem("client");
  const uidHeader = localStorage.getItem("uid");

  const response = await axios.put(
    `${API_BASE_URL}/flows/${uid}`,
    {
      content,
      update_published: updatePublished // This tells the backend to also update published_content
    },
    {
      headers: { 'access-token': accessToken, client, uid: uidHeader },
      withCredentials: true,
    }
  );
  return response.data;
};

export const getFlow = async (flowUid: string) => {
  const accessToken = localStorage.getItem("access-token");
  const client = localStorage.getItem("client");
  const uidHeader = localStorage.getItem("uid");

  const response = await axios.get(`${API_BASE_URL}/flows/${flowUid}`, {
    headers: { 'access-token': accessToken, client, uid: uidHeader },
    withCredentials: true,
  });

  // Convert Ruby arrow syntax to valid JSON if the content is a string
  if (response.data && response.data.content && typeof response.data.content === 'string') {
    try {
      response.data.content = JSON.parse(response.data.content.replace(/=>/g, ':'));
    } catch (error) {
      console.error('Error parsing flow content:', error);
      // Optionally, you can keep the original content or set to a default
      response.data.content = { nodes: [], edges: [] };
    }
  }

  return response.data;
};

export const publishFlow = async (flowUid: string, flow: object) => {
  const accessToken = localStorage.getItem("access-token");
  const client = localStorage.getItem("client");
  const uid = localStorage.getItem("uid");

  const response = await axios.post(
    `${API_BASE_URL}/flows/${flowUid}/publish`,
    { flow },
    {
      headers: { 'access-token': accessToken, client, uid },
      withCredentials: true,
    }
  );
  return response.data;
};

export const updateFlowUrl = async (uid: string, url: string) => {
  const accessToken = localStorage.getItem("access-token");
  const client = localStorage.getItem("client");
  const uidHeader = localStorage.getItem("uid");

  const response = await axios.put(
    `${API_BASE_URL}/flows/${uid}`,
    { flow: { custom_url: url } },
    {
      headers: { 'access-token': accessToken, client, uid: uidHeader },
      withCredentials: true,
    }
  );
  return response.data;
};

export const fetchPublishedFlow = async (customUrl: string) => {
  const response = await axios.get(`${API_BASE_URL}/flows/published/${customUrl}`);
  if (response.data && response.data.published_content && typeof response.data.published_content === 'string') {
    try {
      response.data.published_content = JSON.parse(response.data.published_content.replace(/=>/g, ':'));
    } catch (error) {
      console.error('Error parsing published flow content:', error);
      response.data.published_content = { nodes: [], edges: [] };
    }
  }
  return response.data;
};
