'use client'

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
} from '@chakra-ui/react'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
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
      // Aqui você implementará a lógica de registro
      // Por enquanto, vamos apenas simular um registro bem-sucedido
      await new Promise(resolve => setTimeout(resolve, 1000))
      router.push('/auth/login')
      toast({
        title: 'Cadastro realizado!',
        description: 'Sua conta foi criada com sucesso.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
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
    <Box minH="100vh" bg={useColorModeValue('gray.50', 'gray.900')}>
      <Container maxW="lg" py={{ base: '12', md: '24' }} px={{ base: '0', sm: '8' }}>
        <Stack spacing="8">
          <Stack spacing="6" textAlign="center">
            <Heading size="xl" fontWeight="bold">
              Criar conta no ChatDesk
            </Heading>
            <Text color={useColorModeValue('gray.600', 'gray.400')}>
              Preencha os dados abaixo para se registrar
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
            <form onSubmit={handleRegister}>
              <Stack spacing="6">
                <Stack spacing="5">
                  <FormControl>
                    <FormLabel htmlFor="name">Nome</FormLabel>
                    <Input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </FormControl>
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
                  <FormControl>
                    <FormLabel htmlFor="confirmPassword">Confirmar Senha</FormLabel>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
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
                  Criar conta
                </Button>
              </Stack>
            </form>
          </Box>
          <Text textAlign="center">
            Já tem uma conta?{' '}
            <ChakraLink as={Link} href="/auth/login" color="blue.500">
              Faça login
            </ChakraLink>
          </Text>
        </Stack>
      </Container>
    </Box>
  )
} 