import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Text,
  useColorModeValue,
  Link as ChakraLink,
  useToast,
  Flex,
  Image,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { login, signInWithGoogle } from '../services/authService';
import logo from '../assets/logovendflow.png'; // Ajuste o caminho conforme necessário

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Chama o serviço de login
      await login(email, password);
      toast({
        title: 'Login realizado!',
        description: 'Você foi autenticado com sucesso.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      navigate('/dashboard'); // Redireciona para o painel ou página inicial
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
    <Flex
      direction="column"
      justify="center"
      align="center"
      minH="100vh"
      bg="#f1f1f1"
      p={4} // Adiciona espaçamento para melhor responsividade
    >
      {/* Logo no centro */}
      <Box mb={8} textAlign="center">
        <Image src={logo} alt="Logo" width={['150px', '200px']} />
      </Box>

      {/* Formulário de login sem container */}
      <Box
        width={['90%', '400px']}
        bg={useColorModeValue('white', 'gray.800')}
        p={6}
        borderRadius="lg"
        boxShadow="lg"
      >
        <form onSubmit={handleLogin}>
          <Stack spacing={4}>
            {/* Campo de email */}
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

            {/* Campo de senha */}
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
              bg={'#1a63d8'}
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

            {/* Botão de login com Google */}
            <Button
              bg={'#FF9E2C'}
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

      {/* Link para cadastro */}
      <Text mt={4} textAlign="center" fontSize="sm">
        Não tem uma conta?{' '}
        <ChakraLink as={RouterLink} to="/register" color="blue.500">
          Registre-se
        </ChakraLink>
      </Text>
    </Flex>
  );
}
