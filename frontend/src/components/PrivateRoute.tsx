// src/components/PrivateRoute.tsx
import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useToast } from '@chakra-ui/react';

const isAuthenticated = () => {
  // Check for the auth token stored from login
  return Boolean(localStorage.getItem('access-token'));
};

const PrivateRoute: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [allowed, setAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    if (!isAuthenticated()) {
      toast({
        title: 'Ação restrita',
        description: 'Você precisa estar logado para fazer essa ação.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      // Delay redirection so the toast can be visible
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 100); // Wait a bit longer than the toast duration
      setAllowed(false);
    } else {
      setAllowed(true);
    }
  }, [navigate, toast]);

  // Render nothing while waiting for redirection.
  return allowed ? <Outlet /> : null;
};

export default PrivateRoute;
