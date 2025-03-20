// src/components/PrivateRoute.tsx
import React, { useEffect, useState, useRef } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@chakra-ui/react';

const isAuthenticated = () => {
  const token = localStorage.getItem('access-token');
  const client = localStorage.getItem('client');
  const uid = localStorage.getItem('uid');
  console.log('Authentication check:', { token, client, uid });
  return Boolean(token && client && uid);
};

const PrivateRoute: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const [allowed, setAllowed] = useState<boolean | null>(null);
  const toastShown = useRef(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      if (!toastShown.current) {
        toastShown.current = true;
        toast({
          title: 'Ação restrita',
          description: 'Você precisa estar logado para fazer essa ação.',
          status: 'warning',
          duration: 3000,
          isClosable: true,
        });
      }
      if (location.pathname !== '/login') {
        setTimeout(() => {
          navigate('/login', { replace: true });
        }, 150);
      }
      setAllowed(false);
    } else {
      setAllowed(true);
    }
  }, [navigate, toast, location]);

  return allowed ? <Outlet /> : null;
};

export default PrivateRoute;
