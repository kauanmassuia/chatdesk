import React, { useState } from 'react';
import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalCloseButton,
	ModalBody,
	useToast,
	Box,
	FormControl,
	FormLabel,
	Input,
	Stack,
	Button,
	Text,
	Link as ChakraLink
} from '@chakra-ui/react';
import { register, signInWithGoogle } from '../../services/authService';
import logo from '../../assets/logovendflow.png';

interface RegisterModalProps {
	isOpen: boolean;
	onClose: () => void;
	onRegisterSuccess?: () => void;
}

const RegisterModal: React.FC<RegisterModalProps> = ({ isOpen, onClose, onRegisterSuccess }) => {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const toast = useToast();

	const handleRegister = async (e: React.FormEvent) => {
		e.preventDefault();
		if (password !== confirmPassword) {
			toast({
				title: 'Erro no cadastro',
				description: 'As senhas não coincidem.',
				status: 'error',
				duration: 3000,
				isClosable: true,
			});
			return;
		}
		setIsLoading(true);
		try {
			await register(name, email, password, confirmPassword);
			toast({
				title: 'Cadastro realizado!',
				description: 'Sua conta foi criada com sucesso.',
				status: 'success',
				duration: 3000,
				isClosable: true,
			});
			if (onRegisterSuccess) onRegisterSuccess();
			onClose();
		} catch (error: any) {
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
		<Modal isOpen={isOpen} onClose={onClose} isCentered>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader textAlign="center">
					<Box mb={4}>
						<img src={logo} alt="Logo" width="150px" />
					</Box>
					Crie sua conta para continuar
				</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					<Box
						width="100%"
						maxWidth="400px"
						p={6}
						borderRadius="lg"
						boxShadow="lg"
						mx="auto"
					>
						<form onSubmit={handleRegister}>
							<Stack spacing={4}>
								<FormControl>
									<FormLabel>Nome</FormLabel>
									<Input
										placeholder="Digite seu nome"
										value={name}
										onChange={(e) => setName(e.target.value)}
										required
									/>
								</FormControl>
								<FormControl>
									<FormLabel>Email</FormLabel>
									<Input
										type="email"
										placeholder="Digite seu email"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										required
									/>
								</FormControl>
								<FormControl>
									<FormLabel>Senha</FormLabel>
									<Input
										type="password"
										placeholder="Digite sua senha"
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										required
									/>
								</FormControl>
								<FormControl>
									<FormLabel>Confirmar Senha</FormLabel>
									<Input
										type="password"
										placeholder="Confirme sua senha"
										value={confirmPassword}
										onChange={(e) => setConfirmPassword(e.target.value)}
										required
									/>
								</FormControl>
								<Button
									type="submit"
									colorScheme="blue"
									isLoading={isLoading}
									width="100%"
								>
									Criar Conta
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
                  Registrar com Google
                </Button>
							</Stack>
						</form>
					</Box>
					<Text mt={4} textAlign="center" fontSize="sm">
						Já tem uma conta?{' '}
						<ChakraLink color="blue.500" onClick={onClose}>
							Voltar para Login
						</ChakraLink>
					</Text>
				</ModalBody>
			</ModalContent>
		</Modal>
	);
};

export default RegisterModal;
