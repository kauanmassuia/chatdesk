// services/paymentsService.ts
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';

export const createCheckoutSession = async (): Promise<{ sessionId: string }> => {
  const accessToken = localStorage.getItem("access-token");
  const client = localStorage.getItem("client");
  const uid = localStorage.getItem("uid");
  try {
    const response = await axios.post(`${API_BASE_URL}/create_checkout_session`, {
      headers: { 'access-token': accessToken, client, uid },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error('Error creating checkout session', error);
    throw error;
  }
};
