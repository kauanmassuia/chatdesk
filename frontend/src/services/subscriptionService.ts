// src/services/subscriptionService.ts
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';

export interface SubscriptionResponse {
  effectivePlan: 'free' | 'standard' | 'premium';
  currentPlan: 'free' | 'standard' | 'premium';
  pendingPlan: string | null;
  status: 'active' | 'canceled' | 'trialing' | 'inactive';
  billing_start: string;
  billing_end: string;
  translatedPlan: string;
  pendingTranslatedPlan: string | null;
}

export const getUserSubscription = async (): Promise<SubscriptionResponse> => {
  const accessToken = localStorage.getItem("access-token");
  const client = localStorage.getItem("client");
  const uid = localStorage.getItem("uid");

  try {
    const response = await axios.get(`${API_BASE_URL}/subscription`, {
      headers: {
        'access-token': accessToken,
        client,
        uid,
      },
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    console.error('Erro ao buscar assinatura do usuário:', error);
    throw error;
  }
};

// src/services/subscriptionService.ts
// Adicione esta função ao seu arquivo de serviço de assinatura

export const cancelSubscription = async (): Promise<{ message: string }> => {
  const accessToken = localStorage.getItem("access-token");
  const client = localStorage.getItem("client");
  const uid = localStorage.getItem("uid");

  try {
    const response = await axios.delete(`${API_BASE_URL}/subscription`, {
      headers: {
        'access-token': accessToken,
        client,
        uid,
      },
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    console.error('Erro ao cancelar assinatura:', error);
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error || 'Erro ao cancelar assinatura');
    }
    throw new Error('Erro ao cancelar assinatura. Tente novamente mais tarde.');
  }
};
