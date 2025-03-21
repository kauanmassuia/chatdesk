// src/pages/GoogleOauthSuccess.tsx
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function GoogleOauthSuccess() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);

    // Extract tokens from the query. E.g. tokens[access-token], tokens[client], etc.
    const accessToken = params.get('tokens[access-token]');
    const client = params.get('tokens[client]');
    const uid = params.get('tokens[uid]');
    const tokenType = params.get('tokens[token-type]');
    const expiry = params.get('tokens[expiry]');

    // Optionally extract user data
    const userId = params.get('user[id]');
    const userEmail = params.get('user[email]');
    const userName = params.get('user[name]');

    // Debug: see what's in the URL
    console.log('Google OAuth query params:', {
      accessToken,
      client,
      uid,
      tokenType,
      expiry,
      userId,
      userEmail,
      userName
    });

    // Store them if they exist
    if (accessToken && client && uid) {
      localStorage.setItem('access-token', accessToken);
      localStorage.setItem('client', client);
      localStorage.setItem('uid', uid);
      // If you want the name, email, etc.:
      if (userName) localStorage.setItem('userName', userName);
      if (userEmail) localStorage.setItem('userEmail', userEmail);
    }

    // Finally, navigate to your dashboard
    navigate('/dashboard', { replace: true });
  }, [location, navigate]);

  return <div>Processing Google OAuth...</div>;
}
