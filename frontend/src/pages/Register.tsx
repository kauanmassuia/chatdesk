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
  Flex,
  Image,
} from '@chakra-ui/react'
import { useState } from 'react'
import { useNavigate, Link as RouterLink } from 'react-router-dom'
import { register, signInWithGoogle } from '../services/authService'
import logo from '../assets/logovendflow.png'  // Ajuste o caminho conforme a estrutura do seu projeto

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const toast = useToast()

  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.600')

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    if (password !== confirmPassword) {
      toast({
        title: 'Erro no cadastro',
        description: 'As senhas não coincidem.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      setIsLoading(false)
      return
    }

    try {
      await register(name, email, password, confirmPassword)
      toast({
        title: 'Cadastro realizado!',
        description: 'Sua conta foi criada com sucesso.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
      navigate('/dashboard')
    } catch (error) {
      toast({
        title: 'Erro no cadastro',
        description: 'Ocorreu um erro ao criar sua conta.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Flex direction={{ base: 'column', lg: 'row' }} minH="100vh">
      {/* Left Side with background or image */}
      <Box
        flex="1"
        bgColor="#f1f1f1"
        display="flex"
        justifyContent="center"
        alignItems="center"
        color="white"
        borderTopLeftRadius="xl"
        borderBottomLeftRadius="xl"
        d={{ base: 'none', lg: 'block' }} // Hide on small screens
        height="100vh"
        position="relative"
      >
        <Box position="absolute" top="5" left="0" fontSize="xl" fontWeight="bold">
          <Image
            src={logo}
            alt="Logo"
            width="200px" // Ajuste a largura conforme necessário
            objectFit="contain" // Mantém a proporção original da imagem
          />
        </Box>

        {/* Frase sobre o produto */}
        <Box
          position="absolute"
          top="6%" // Ajustado para posicionar mais para cima
          left="50%"
          transform="translateX(-50%)"
          textAlign="center"
          color="black"
          fontSize="xl"
          fontWeight="bold"
          maxWidth="80%" // Limita o tamanho da frase
        >
          <Text>
            Crie Chatbots personalizados e automatize seu atendimento
          </Text>
        </Box>

        {/* Video in the middle with rounded borders and shadow */}
        <Box
          position="absolute"
          top="50%" // Centraliza verticalmente
          left="50%" // Centraliza horizontalmente
          transform="translate(-50%, -50%)"
          borderRadius="xl"
          boxShadow="md"
          overflow="hidden"
          width="80%" // Ajuste a largura conforme necessário
          height="50%" // Ajuste a altura conforme necessário
        >
          <iframe
            src="https://www.youtube.com/embed/your_video_id" // Substitua com o seu link de vídeo
            width="100%"
            height="100%"
            frameBorder="0"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </Box>
      </Box>

      {/* Divider line */}
      <Box width="1px" bgColor="#f1f1f1" height="100vh" />

      {/* Right Side with form */}
      <Box
        flex="1"
        py={{ base: '6', md: '12' }}
        px={{ base: '4', sm: '6' }}
        bg="#f1f1f1"
        boxShadow={{ base: 'none', sm: 'md' }}
        borderRadius={{ base: 'none', sm: 'lg' }}
        borderWidth={1}
        borderColor={borderColor}
        height="100vh"
        overflow="hidden"
      >
        {/* Wrap the form inside a Container with white background */}
        <Container
          maxW="lg"
          bg="white"
          p="8"
          borderRadius="lg"
          boxShadow="lg"
          height="auto"
        >
          <Stack spacing="5">
            <Stack spacing="4" textAlign="center">
              <Heading size="md" fontWeight="bold" fontSize="lg">
                Criar conta no VendFlow
              </Heading>
              <Text color={useColorModeValue('gray.600', 'gray.400')} fontSize="sm">
                Preencha os dados abaixo para se registrar
              </Text>
            </Stack>
            <Box>
              <form onSubmit={handleRegister}>
                <Stack spacing="4">
                  <FormControl>
                    <FormLabel htmlFor="name" fontSize="sm">
                      Nome
                    </FormLabel>
                    <Input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      fontSize="sm"
                      size="sm"
                      placeholder="Digite seu nome"
                    />
                  </FormControl>
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
                      fontSize="sm"
                      size="sm"
                      placeholder="Digite seu email"
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
                      fontSize="sm"
                      size="sm"
                      placeholder="Digite sua senha"
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel htmlFor="confirmPassword" fontSize="sm">
                      Confirmar Senha
                    </FormLabel>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      fontSize="sm"
                      size="sm"
                      placeholder="Confirme sua senha"
                    />
                  </FormControl>
                  <Stack spacing="3">
                    <Button
                      type="submit"
                      color="white"
                      size="sm"
                      isLoading={isLoading}
                      width="full"
                      fontSize="sm"
                      bg="#1a63d8"
                      borderColor="#1a63d8"
                      variant={"outline"}
                      _hover={{
                        bg: 'white',
                        color: '#1a63d8',
                        borderColor: '#1a63d8',
                      }}
                    >
                      Criar conta
                    </Button>
                    <Button
                      bg={"#FF9E2C"}
                      variant="outline"
                      color="#FF9E2C"
                      size="sm"
                      fontSize="sm"
                      onClick={signInWithGoogle}
                      isLoading={isLoading}
                      width="full"
                      borderColor="#FF9E2C"
                      textColor={"White"}
                      _hover={{
                        bg: 'white',
                        color: '#FF9E2C',
                        borderColor: '#FF9E2C',
                      }}
                    >
                      Cadastro com Google
                    </Button>
                  </Stack>
                </Stack>
              </form>
            </Box>
            <Text textAlign="center" fontSize="sm">
              Já tem uma conta?{' '}
              <ChakraLink as={RouterLink} to="/login" color="blue.500">
                Faça login
              </ChakraLink>
            </Text>
          </Stack>
        </Container>
      </Box>
    </Flex>
  )
}
