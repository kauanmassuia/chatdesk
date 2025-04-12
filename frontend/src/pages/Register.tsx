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
  useToast,
  Flex,
  Image,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register, signInWithGoogle } from '../services/authService';
import logo from '../assets/logovendflow.png';
import googleLogo from '../assets/logogoogleauth.png';
import videolp from '../assets/videocomofuncionaflow.mp4';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    if (password !== confirmPassword) {
      toast({
        title: 'Erro no cadastro',
        description: 'As senhas não coincidem.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      setIsLoading(false);
      return;
    }

    try {
      await register(name, email, password, confirmPassword);
      toast({
        title: 'Cadastro realizado!',
        description: 'Sua conta foi criada com sucesso.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: 'Erro no cadastro',
        description: 'Ocorreu um erro ao criar sua conta.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box minH="100vh" bg="#f1f1f1">
      <Flex direction={{ base: 'column', lg: 'row' }} minH="100vh">
        {/* Left Container - Escondido no Mobile */}
        <Box
          flex={{ base: 'none', lg: '1' }}
          p={{ base: '4%', lg: '5%' }}
          display={{ base: 'none', lg: 'flex' }}
          flexDirection="column"
          alignItems="center"
        >
          {/* Logo */}
          <Image src={logo} alt="Logo" width="50%" mb="4%" mt={{ lg: '-6%' }} />

          {/* Texto e Vídeo */}
          <Box textAlign="center" width="100%">
            <Text fontSize="xl" fontWeight="bold" color="black" mb="4">
              Crie Chatbots personalizados e automatize seu atendimento
            </Text>
          </Box>

          <Box
            borderRadius="20px"
            boxShadow="md"
            overflow="hidden"
            width="85%"
            height="auto"
            mt="4%"
            transition="transform 0.3s ease-in-out"
            _hover={{ transform: 'scale(1.1)' }}
            maxWidth="100%"
            position="relative"
          >
            <video width="100%" height="100%" autoPlay loop muted playsInline>
              <source src={videolp} type="video/mp4" />
              Seu navegador não suporta vídeos.
            </video>
          </Box>
        </Box>

        {/* Divider - Somente para telas grandes */}
        <Box width=".2%" bgColor="gray.400" height="100%" display={{ base: 'none', lg: 'block' }} />

        {/* Right Container (Form) */}
        <Box flex="1" display="flex" alignItems="center" justifyContent="center" p={{ base: '6%', lg: '4%' }}>
          <Container maxW="md" bg="white" p={6} borderRadius="lg" boxShadow="lg">
            <Stack spacing={3}>
              {/* Logo no Mobile */}
              <Image src={logo} alt="Logo" width="40%" mx="auto" display={{ base: 'block', lg: 'none' }} mb={4} />

              <Heading size="md" textAlign="center">
                Criar conta no VendFlow
              </Heading>
              <Text textAlign="center" color="gray.600">
                Preencha os dados abaixo para se registrar
              </Text>
              <form onSubmit={handleRegister}>
                <Stack spacing={4}>
                  <FormControl>
                    <FormLabel>Nome</FormLabel>
                    <Input value={name} onChange={(e) => setName(e.target.value)} required />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Email</FormLabel>
                    <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Senha</FormLabel>
                    <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Confirmar Senha</FormLabel>
                    <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                  </FormControl>
                  <Button
                    type="submit"
                    colorScheme="blue"
                    isLoading={isLoading}
                    width="100%"
                    bg="#2575fc"
                    color="white"
                    _hover={{ bg: 'white', color: '#2575fc', border: '2px solid #2575fc' }}
                  >
                    Criar conta
                  </Button>
                  <Button
                    onClick={signInWithGoogle}
                    bg="#ff9e2c"
                    color="white"
                    _hover={{ bg: 'white', color: '#ff9e2c', border: '2px solid #ff9e2c' }}
                    width="100%"
                  >
                    <Image src={googleLogo} alt="Google" boxSize="20px" mr={2} /> Cadastro com Google
                  </Button>
                </Stack>
              </form>
            </Stack>
          </Container>
        </Box>
      </Flex>
    </Box>
  );
}
