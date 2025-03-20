// src/services/authService.ts
import axios from 'axios'

// Define your API base URL (adjust as needed or load from environment variables)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1/auth'

// Registration function
export const register = async (
  name: string,
  email: string,
  password: string,
  passwordConfirmation: string
) => {
  try {
    const response = await axios.post(
      API_BASE_URL,
      {
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
      },
      { withCredentials: true }
    )
    return response.data
  } catch (error) {
    console.error('Registration error:', error)
    throw error
  }
}

// Login function using email/password
export const login = async (email: string, password: string) => {
  const response = await axios.post(
    `${API_BASE_URL}/sign_in`,
    { email, password },
    { withCredentials: true }
  );
  return response.data;
};


export const signInWithGoogle = () => {
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1/auth';
  window.location.href = `${API_BASE_URL}/google_oauth2?auth_origin_url=${window.location.origin}&resource_class=User&namespace_name=api_v1`;
}
