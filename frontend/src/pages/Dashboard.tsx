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
                transition="transform 0.2s"
                _hover={{ transform: 'scale(1.02)' }}
                _active={{ transform: 'scale(0.98)' }}
                onClick={() => navigate(`/editor?flow_id=${flow.uid}`)}
                cursor="pointer"
              >
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
<Modal isOpen={isSettingsOpen} onClose={onSettingsClose} size="xl">
  <ModalOverlay />
  <ModalContent>
    <ModalHeader>Billing & Usage</ModalHeader>
    <ModalCloseButton />
    <ModalBody>
      {/* Seção de Uso */}
      <Box mb={6}>
        <Heading size="sm" mb={2}>Usage</Heading>
        <Text fontSize="sm">Chats <Text as="span" fontWeight="bold">Resets on 30/04/2025</Text></Text>
        <Text fontSize="lg" fontWeight="bold">0 / 200</Text>
      </Box>

      {/* Seção de Assinatura */}
      <Box mb={6}>
        <Heading size="sm" mb={2}>Subscription</Heading>
        <Text fontSize="sm">Current workspace subscription: <Text as="span" fontWeight="bold">Free</Text></Text>
        <Text fontSize="xs" mt={2}>
          Typebot is contributing 1% of your subscription to remove CO₂ from the atmosphere.{' '}
          <Text as="a" href="#" color="blue.500" textDecoration="underline">Learn more</Text>
        </Text>
      </Box>

      {/* Planos de Assinatura */}
      <Flex gap={4}>
        {/* Plano Starter */}
        <Box
          borderWidth="1px"
          borderRadius="md"
          p={4}
          flex={1}
          bg="gray.50"
          borderColor="gray.200"
        >
          <Heading size="md" color="#ff9e2c">Upgrade to Starter</Heading>
          <Text mt={2} fontSize="sm">For individuals & small businesses.</Text>
          <Heading size="lg" mt={4}>$39/month</Heading>
          <Box mt={4}>
            <Text fontSize="sm">✔ 2 seats included</Text>
            <Text fontSize="sm">✔ 2,000 chats/mo</Text>
            <Text fontSize="xs">(Extra chats: $10 per 500)</Text>
            <Text fontSize="sm">✔ Branding removed</Text>
            <Text fontSize="sm">✔ File upload input block</Text>
            <Text fontSize="sm">✔ Create folders</Text>
            <Text fontSize="sm">✔ Direct priority support</Text>
          </Box>
          <Button mt={4} colorScheme="orange" width="full">
            Upgrade
          </Button>
        </Box>

        {/* Plano Pro */}
        <Box
          borderWidth="1px"
          borderRadius="md"
          p={4}
          flex={1}
          bg="#f9f5ff"
          borderColor="#d6bbfc"
        >
          <Flex justifyContent="space-between">
            <Heading size="md" color="#6b46c1">Upgrade to Pro</Heading>
            <Box bg="#6b46c1" color="white" px={2} py={1} borderRadius="md">
              Most popular
            </Box>
          </Flex>
          <Text mt={2} fontSize="sm">For agencies & growing startups.</Text>
          <Heading size="lg" mt={4}>$89/month</Heading>
          <Box mt={4}>
            <Text fontSize="sm">✔ Everything in Starter, plus:</Text>
            <Text fontSize="sm">✔ 5 seats included</Text>
            <Text fontSize="sm">✔ 10,000 chats/mo</Text>
            <Text fontSize="xs">(Extra chats: See tiers)</Text>
            <Text fontSize="sm">✔ WhatsApp integration</Text>
            <Text fontSize="sm">✔ Custom domains</Text>
            <Text fontSize="sm">✔ In-depth analytics</Text>
          </Box>
          <Button mt={4} colorScheme="purple" width="full">
            Upgrade
          </Button>
        </Box>
      </Flex>

      {/* Link para customização */}
      <Box textAlign="center" mt={6}>
        Need custom limits? Specific features?{' '}
        <Text as="a" href="#" color="blue.500" textDecoration="underline">
          Let's chat!
        </Text>
      </Box>

      {/* Versão do sistema */}
      <Box textAlign="right" mt={6}>
        Version: 3.8.0
      </Box>
    </ModalBody>

    {/* Botão de Fechar */}
    <ModalFooter justifyContent={"flex-end"}>
      <Button variant={"ghost"} onClick={onSettingsClose}>
        Fechar
      </Button>
    </ModalFooter>
  </ModalContent>
</Modal>


      <CreateFlowModal isOpen={isOpen} onClose={onClose} onCreate={handleCreateFlow} />
    </Box>
  );
}
