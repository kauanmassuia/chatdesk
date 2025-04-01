import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const SubscriptionSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    const timeout = setTimeout(() => {
      navigate('/dashboard');
    }, 3000);

    return () => clearTimeout(timeout);
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center bg-gray-100">
      <div className="w-[100px] h-[100px] mb-5">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 52 52"
          className="w-full h-full stroke-green-500 stroke-2 stroke-linecap-round stroke-linejoin-round fill-none scale-animation"
        >
          <circle cx="26" cy="26" r="25" fill="none" className="dash-circle" />
          <path d="M14 27 l7 7 l16 -16" fill="none" className="dash-check" />
        </svg>
      </div>
      <h1 className="text-2xl mb-2 text-gray-800">Subscription Successful!</h1>
      <p className="text-base text-gray-600">Thank you for subscribing!</p>
      <p className="text-base text-gray-600">redirecting you to Dashboard</p>

      <style>
        {`
          @keyframes dashCircle {
            to {
              stroke-dashoffset: 0;
            }
          }
          @keyframes dashCheck {
            to {
              stroke-dashoffset: 0;
            }
          }
          @keyframes scaleAnimation {
            0% {
              transform: scale(0);
            }
            60% {
              transform: scale(1.2);
            }
            100% {
              transform: scale(1);
            }
          }
          .scale-animation {
            animation: scaleAnimation 0.3s ease-in-out forwards;
          }
          .dash-circle {
            stroke-dasharray: 166;
            stroke-dashoffset: 166;
            stroke-width: 2;
            stroke-miterlimit: 10;
            animation: dashCircle 0.6s ease-in-out forwards;
          }
          .dash-check {
            stroke-dasharray: 48;
            stroke-dashoffset: 48;
            animation: dashCheck 0.3s 0.6s ease-in-out forwards;
          }
        `}
      </style>
    </div>
  );
};

export default SubscriptionSuccess;
