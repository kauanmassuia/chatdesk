// src/services/authService.ts
import axios from 'axios'

// Define your API base URL (using environment variable if set)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1/auth'

// Registration function for email/password sign up
export const register = async (
  name: string,
  email: string,
  password: string,
  passwordConfirmation: string
) => {
  try {
    const response = await axios.post(
      API_BASE_URL, // POST to /api/v1/auth (registration endpoint)
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

// Login function for email/password sign in
export const login = async (email: string, password: string) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/sign_in`,
      { email, password },
      { withCredentials: true }
    )

    // Capture authentication tokens from response headers
    const accessToken = response.headers['access-token']
    const client = response.headers['client']
    const uid = response.headers['uid']

    if (accessToken && client && uid) {
      localStorage.setItem('access-token', accessToken)
      localStorage.setItem('client', client)
      localStorage.setItem('uid', uid)
    }

    return response.data
  } catch (error) {
    console.error('Login error:', error)
    throw error
  }
}

// Logout function to sign the user out
export const logout = async () => {
  try {
    const accessToken = localStorage.getItem("access-token")
    const client = localStorage.getItem("client")
    const uid = localStorage.getItem("uid")

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
    )

    // Clear stored tokens upon logout
    localStorage.removeItem("access-token")
    localStorage.removeItem("client")
    localStorage.removeItem("uid")

    return response.data
  } catch (error) {
    console.error('Logout error:', error)
    throw error
  }
}

// Function to initiate Google OAuth login
export const signInWithGoogle = () => {
  // Redirect user to Google OAuth endpoint with required query parameters
  window.location.href = `${API_BASE_URL}/google_oauth2?auth_origin_url=${window.location.origin}&resource_class=User&namespace_name=api_v1`
}
