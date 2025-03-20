// src/services/authService.ts
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1/auth';

const storeAuthTokens = (headers: any) => {
  const accessToken = headers['access-token'];
  const client = headers['client'];
  const uid = headers['uid'];
  console.log('Storing tokens:', { accessToken, client, uid });
  if (accessToken && client && uid) {
    localStorage.setItem('access-token', accessToken);
    localStorage.setItem('client', client);
    localStorage.setItem('uid', uid);
  } else {
    console.warn('Missing one or more auth tokens');
  }
};

export const login = async (email: string, password: string) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/sign_in`,
      { email, password },
      { withCredentials: true }
    );
    storeAuthTokens(response.headers);
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const register = async (
  name: string,
  email: string,
  password: string,
  passwordConfirmation: string
) => {
  try {
    const response = await axios.post(
      API_BASE_URL,
      { name, email, password, password_confirmation: passwordConfirmation },
      { withCredentials: true }
    );
    storeAuthTokens(response.headers);
    return response.data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

export const logout = async () => {
  try {
    const accessToken = localStorage.getItem('access-token');
    const client = localStorage.getItem('client');
    const uid = localStorage.getItem('uid');

    const response = await axios.delete(
      `${API_BASE_URL}/sign_out`,
      {
        headers: { 'access-token': accessToken, client, uid },
        withCredentials: true,
      }
    );
    localStorage.removeItem('access-token');
    localStorage.removeItem('client');
    localStorage.removeItem('uid');
    return response.data;
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};

export const signInWithGoogle = () => {
  window.location.href = `${API_BASE_URL}/google_oauth2?auth_origin_url=${window.location.origin}&resource_class=User&namespace_name=api_v1`;
};
