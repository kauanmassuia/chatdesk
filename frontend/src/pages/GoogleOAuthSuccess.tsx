// src/pages/GoogleOauthSuccess.tsx
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { createCheckoutSession } from '../services/paymentService';
import { loadStripe } from '@stripe/stripe-js';

export default function GoogleOauthSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
  const stripePromise = loadStripe(stripePublishableKey || '');

  useEffect(() => {
    const processLogin = async () => {
      const params = new URLSearchParams(location.search);

      const accessToken = params.get('tokens[access-token]');
      const client = params.get('tokens[client]');
      const uid = params.get('tokens[uid]');
      const tokenType = params.get('tokens[token-type]');
      const expiry = params.get('tokens[expiry]');

      const userId = params.get('user[id]');
      const userEmail = params.get('user[email]');
      const userName = params.get('user[name]');

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

      if (accessToken && client && uid) {
        localStorage.setItem('access-token', accessToken);
        localStorage.setItem('client', client);
        localStorage.setItem('uid', uid);
        if (userName) localStorage.setItem('userName', userName);
        if (userEmail) localStorage.setItem('userEmail', userEmail);
      }

      const pendingPlan = localStorage.getItem('pending-plan');
      if (pendingPlan) {
        try {
          const { sessionId: newSessionId } = await createCheckoutSession(pendingPlan as 'standard' | 'premium');
          const stripe = await stripePromise;
          if (stripe) {
            const { error } = await stripe.redirectToCheckout({ sessionId: newSessionId });
            if (error) {
              console.error('Redirect error:', error);
              navigate('/dashboard', { replace: true });
            }
          } else {
            console.error('Stripe failed to initialize.');
            navigate('/dashboard', { replace: true });
          }
        } catch (error) {
          console.error('Checkout session error:', error);
          navigate('/dashboard', { replace: true });
        }
      } else {
        navigate('/dashboard', { replace: true });
      }
    };

    processLogin();
  }, [location, navigate, stripePromise]);

  return <div>Processing Google OAuth...</div>;
}
