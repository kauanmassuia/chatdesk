// src/services/subscriptionService.ts
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';

export interface SubscriptionResponse {
  plan: 'free' | 'standard' | 'premium';
  translatedPlan: 'Grátis' | 'Básico' | 'Premium';
  status: 'active' | 'canceled' | 'trialing';
  billing_start: string;
  billing_end: string;
}

const mapPlanNameToPT = (plan: string): 'Grátis' | 'Básico' | 'Premium' => {
  switch (plan) {
    case 'free':
      return 'Grátis';
    case 'standard':
      return 'Básico';
    case 'premium':
      return 'Premium';
    default:
      return 'Grátis';
  }
};

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

    const rawData = response.data;
    const translatedPlan = mapPlanNameToPT(rawData.plan);

    return {
      ...rawData,
      translatedPlan,
    };
  } catch (error) {
    console.error('Erro ao buscar assinatura do usuário:', error);
    throw error;
  }
};
