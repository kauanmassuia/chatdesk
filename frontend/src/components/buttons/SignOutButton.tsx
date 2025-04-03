// src/components/SignOutButton.tsx
import React from 'react';
import { Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../services/authService';

const SignOutButton: React.FC = () => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <Button onClick={handleSignOut} colorScheme="red">
      Sign Out
    </Button>
  );
};

export default SignOutButton;
