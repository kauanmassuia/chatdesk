// src/services/authService.ts
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1/auth';

// src/services/authService.ts
const storeAuthTokens = (headers: any) => {
  const accessToken = headers['access-token'];
  const client = headers['client'];
  const uid = headers['uid'];

  console.log('Storing tokens:', { accessToken, client, uid });

  if (accessToken && client && uid) {
    // Store the tokens in localStorage
    localStorage.setItem('access-token', accessToken);
    localStorage.setItem('client', client);
    localStorage.setItem('uid', uid);
  } else {
    console.warn('Missing one or more auth tokens');
  }
};

// Login function
export const login = async (email: string, password: string) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/sign_in`,
      { email, password },
      { withCredentials: true }
    );

    // Ensure tokens are stored correctly
    storeAuthTokens(response.headers); // Store tokens in localStorage
    return response.data; // Return the user data or necessary info
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

// src/services/authService.ts
export const logout = async () => {
  try {
    const accessToken = localStorage.getItem("access-token");
    const client = localStorage.getItem("client");
    const uid = localStorage.getItem("uid");

    const response = await axios.delete(
      `${API_BASE_URL}/sign_out`,
      {
        headers: {
          'access-token': accessToken,
          client,
          uid,
        },
        withCredentials: true,
      }
    );

    // Remove tokens from localStorage after logout
    localStorage.removeItem('access-token');
    localStorage.removeItem('client');
    localStorage.removeItem('uid');

    console.log('Tokens removed from localStorage');
    return response.data;
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};


export const signInWithGoogle = () => {
  window.location.href = `${API_BASE_URL}/google_oauth2?auth_origin_url=${window.location.origin}&resource_class=User&namespace_name=api_v1`;
};
