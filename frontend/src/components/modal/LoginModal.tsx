import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  useColorModeValue,
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Button,
  Text,
  Link as ChakraLink,
  useToast
} from '@chakra-ui/react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { login, signInWithGoogle } from '../../services/authService';
import logo from '../../assets/logovendflow.png';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: () => void; // New callback when login is successful
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(email, password);
      toast({
        title: 'Login realizado!',
        description: 'Você foi autenticado com sucesso.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      if (onLoginSuccess) onLoginSuccess(); // Invoke onLoginSuccess if provided
      onClose();
    } catch (error: any) {
      toast({
        title: 'Erro ao fazer login',
        description: error.response?.data?.errors || 'Verifique suas credenciais e tente novamente.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textAlign="center">
          <Box mb={4}>
            <img src={logo} alt="Logo" width="150px" />
          </Box>
          Faça login para continuar
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box
            width="100%"
            maxWidth="400px"
            bg={useColorModeValue('white', 'gray.800')}
            p={6}
            borderRadius="lg"
            boxShadow="lg"
            mx="auto"
          >
            <form onSubmit={handleLogin}>
              <Stack spacing={4}>
                <FormControl>
                  <FormLabel htmlFor="email" fontSize="sm">
                    Email
                  </FormLabel>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    border="none"
                    borderBottom="2px solid"
                    borderColor={useColorModeValue('gray.300', 'gray.500')}
                    focusBorderColor="blue.500"
                    _focus={{ borderBottom: '2px solid' }}
                    placeholder="Digite seu email"
                    _placeholder={{ color: useColorModeValue('gray.500', 'gray.400') }}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel htmlFor="password" fontSize="sm">
                    Senha
                  </FormLabel>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    border="none"
                    borderBottom="2px solid"
                    borderColor={useColorModeValue('gray.300', 'gray.500')}
                    focusBorderColor="blue.500"
                    _focus={{ borderBottom: '2px solid' }}
                    placeholder="Digite sua senha"
                    _placeholder={{ color: useColorModeValue('gray.500', 'gray.400') }}
                  />
                </FormControl>
                <Button
                  bg={"#1a63d8"}
                  type="submit"
                  color="white"
                  isLoading={isLoading}
                  width="100%"
                  height="40px"
                  fontSize="14px"
                  padding="8px"
                  border="1px solid transparent"
                  _hover={{
                    bg: 'white',
                    color: '#1a63d8',
                    borderColor: '#1a63d8',
                  }}
                >
                  Entrar
                </Button>
                <Button
                  bg={"#FF9E2C"}
                  variant="outline"
                  color="white"
                  isLoading={isLoading}
                  width="100%"
                  height="40px"
                  fontSize="14px"
                  padding="8px"
                  onClick={signInWithGoogle}
                  _hover={{
                    bg: 'white',
                    color: '#FF9E2C',
                    borderColor: '#FF9E2C',
                  }}
                >
                  Entrar com Google
                </Button>
              </Stack>
            </form>
          </Box>
          <Text mt={4} textAlign="center" fontSize="sm">
            Não tem uma conta?{' '}
            <ChakraLink as={RouterLink} to="/register" color="blue.500" onClick={onClose}>
              Registre-se
            </ChakraLink>
          </Text>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default LoginModal;
