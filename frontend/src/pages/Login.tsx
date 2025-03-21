import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Text,
  useColorModeValue,
  Link as ChakraLink,
  useToast,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { login, signInWithGoogle } from '../services/authService';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Call the login service
      await login(email, password);
      toast({
        title: 'Login realizado!',
        description: 'Você foi autenticado com sucesso.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      navigate('/dashboard'); // Redirect to your dashboard or home page
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
    <Box minH="100vh" bg={useColorModeValue('gray.50', 'gray.900')}>
      <Container maxW="lg" py={{ base: '12', md: '24' }} px={{ base: '0', sm: '8' }}>
        <Stack spacing="8">
          <Stack spacing="6" textAlign="center">
            <Heading size="xl" fontWeight="bold">
              ChatDesk
            </Heading>
            <Text color={useColorModeValue('gray.600', 'gray.400')}>
              Faça login para acessar sua conta
            </Text>
          </Stack>
          <Box
            py={{ base: '0', sm: '8' }}
            px={{ base: '4', sm: '10' }}
            bg={bgColor}
            boxShadow={{ base: 'none', sm: 'md' }}
            borderRadius={{ base: 'none', sm: 'xl' }}
            borderWidth={1}
            borderColor={borderColor}
          >
            <form onSubmit={handleLogin}>
              <Stack spacing="6">
                <Stack spacing="5">
                  <FormControl>
                    <FormLabel htmlFor="email">Email</FormLabel>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel htmlFor="password">Senha</FormLabel>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </FormControl>
                </Stack>
                <Button
                  type="submit"
                  colorScheme="blue"
                  size="lg"
                  fontSize="md"
                  isLoading={isLoading}
                >
                  Entrar
                </Button>
                <Button
                  variant="outline"
                  colorScheme="red"
                  size="lg"
                  fontSize="md"
                  onClick={signInWithGoogle}
                  isLoading={isLoading}
                >
                  Entrar com Google
                </Button>
              </Stack>
            </form>
          </Box>
          <Text textAlign="center">
            Não tem uma conta?{' '}
            <ChakraLink as={RouterLink} to="/register" color="blue.500">
              Registre-se
            </ChakraLink>
          </Text>
        </Stack>
      </Container>
    </Box>
  );
}
