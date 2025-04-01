import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Container,
  Flex,
  HStack,
  Heading,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spinner,
  Text,
  useColorModeValue,
  useToast,
  useDisclosure,
  Image,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from '@chakra-ui/react';
import { FiPlus, FiSettings, FiChevronDown, FiLogOut } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { logout } from '../services/authService';
import { getFlows, createFlow } from '../services/flowService';
import CreateFlowModal from '../components/modal/CreateFlowModal';

export default function Dashboard() {
  const navigate = useNavigate();
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isSettingsOpen, onOpen: onSettingsOpen, onClose: onSettingsClose } = useDisclosure();

  const userName = localStorage.getItem('userName') || 'Guest';
  const [flows, setFlows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFlows = async () => {
    setLoading(true);
    try {
      const data = await getFlows();
      setFlows(data);
    } catch (error) {
      console.error("Error fetching flows:", error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os flows.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlows();
  }, []);

  const handleCreateFlow = async (title: string) => {
    try {
      const newFlow = await createFlow(title, {});
      toast({
        title: 'Flow criado',
        description: 'Flow criado com sucesso. Redirecionando para o editor...',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      fetchFlows();
    } catch (error) {
      console.error('Error creating flow:', error);
      toast({
        title: 'Erro',
        description: 'Houve um erro ao criar o flow. Tente novamente.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <Box minH="100vh" bg={bgColor}>
      {/* Header */}
      <Box w="full" py={4} px={6} borderBottom="1px" borderColor={borderColor} bg={cardBg}>
        <Container maxW="1440px">
          <Flex justify="space-between" align="center">
          <Box>
          {/* Substituindo o ícone pela logo */}
          <Image 
            src="../src/assets/logovendflow.png" 
            alt="Logo" 
            width={{ base: "40%", md: "20%", lg: "55%" }}  // Tamanhos diferentes para cada tamanho de tela
            height="auto"  // Manter a proporção da imagem
            align={"left"} // Alinhando à esquerda
            marginTop={2} // Margem superior para espaçamento
            marginBottom={2} // Margem inferior para espaçamento
            marginLeft={-14} // Margem esquerda para espaçamento

          />
        </Box>
            <HStack spacing={4}>
              <Button leftIcon={<FiSettings />} variant="ghost" size="sm" onClick={onSettingsOpen}>
                Configurações e Membros
              </Button>
              <Text>{userName}'s workspace</Text>
              <Menu>
                <MenuButton as={Button} rightIcon={<FiChevronDown />} variant="ghost" size="sm">
                  Área de trabalho
                </MenuButton>
                <MenuList>
                  <MenuItem>Perfil Kauan Massuia</MenuItem>
                  <MenuItem>Criar perfil</MenuItem>
                </MenuList>
              </Menu>
              <Button
                leftIcon={<FiLogOut />}
                variant="ghost"
                size="sm"
                colorScheme="red"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </HStack>
          </Flex>
        </Container>
      </Box>

      {/* Conteúdo Principal */}
      <Container maxW="1440px" py={8}>
        <Flex gap={6} wrap="wrap" justify="flex-start">
          <Box
            as="button"
            onClick={onOpen}
            w={{ base: "100%", md: "300px" }}
            h="200px"
            bg="#ff9e2c"
            color="white"
            borderRadius="lg"
            p={6}
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            transition="transform 0.2s"
            _hover={{ transform: 'scale(1.02)' }}
            _active={{ transform: 'scale(0.98)' }}
          >
            <Icon as={FiPlus} boxSize={8} mb={4} />
            <Heading size="md">Create a Flow</Heading>
          </Box>

          {loading ? (
            <Spinner size="xl" />
          ) : (
            flows.map((flow) => (
                <Box
                key={flow.id}
                w={{ base: "100%", sm: "48%", md: "300px" }}
                h="200px"
                bg={cardBg}
                border="1px"
                borderColor={borderColor}
                borderRadius="lg"
                p={6}
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                boxShadow="md"
                position="relative"
                transition="transform 0.2s"
                _hover={{ transform: 'scale(1.02)' }}
                _active={{ transform: 'scale(0.98)' }}
                onClick={() => navigate(`/editor?flow_id=${flow.uid}`)}
                cursor="pointer"
                >
                {/* Menu in the top-right corner */}
                <Menu>
                  <MenuButton
                  as={Button}
                  size="sm"
                  position="absolute"
                  top="8px"
                  right="8px"
                  variant="ghost"
                  >
                  <FiChevronDown />
                  </MenuButton>
                  <MenuList>
                    <MenuItem onClick={() => console.log('Deletar flow', flow.id)}>Deletar</MenuItem>
                    <MenuItem onClick={() => console.log('Duplicar flow', flow.id)}>Duplicar</MenuItem>
                    <MenuItem onClick={() => console.log('Não publicar flow', flow.id)}>Despublicar</MenuItem>
                  </MenuList>
                </Menu>

                <Heading size="md" mb={2}>
                  {flow.title}
                </Heading>
                <Text>{flow.published ? 'Publicado' : 'Rascunho'}</Text>
                </Box>
            ))
          )}
        </Flex>
      </Container>

      {/* Modal de Configurações */}
<Modal isOpen={isSettingsOpen} onClose={onSettingsClose}>
  <ModalOverlay />
  <ModalContent>
    <ModalHeader>Configurações e Membros</ModalHeader>
    <ModalCloseButton />
    <ModalBody>
      {/* Conteúdo atualizado */}
      <Text fontWeight="bold">Current date:</Text>
      <Text mt={2}>Tuesday, April 01, 2025, 1:32 PM -03</Text>
      <Box mt={4}>
        <Text fontWeight="bold">Search results:</Text>
        <Box mt={2}>
          <Image
            src="https://pplx-res.cloudinary.com/image/upload/v1743525057/user_uploads/uWGlroqHNLWHuEu/image.jpg"
            alt="Attached image"
            borderRadius="md"
            boxShadow="md"
          />
          <Text mt={2}>File name: image.jpg</Text>
        </Box>
      </Box>
    </ModalBody>
    <ModalFooter>
      <Button variant="ghost" onClick={onSettingsClose}>
        Fechar
      </Button>
    </ModalFooter>
  </ModalContent>
</Modal>

      <CreateFlowModal isOpen={isOpen} onClose={onClose} onCreate={handleCreateFlow} />
    </Box>
  );
}
