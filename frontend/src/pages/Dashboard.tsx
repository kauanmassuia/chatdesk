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
} from '@chakra-ui/react';
import { FiPlus, FiSettings, FiChevronDown, FiFolderPlus, FiLogOut } from 'react-icons/fi';
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

  // Retrieve the user's name (from Google OAuth or registration)
  const userName = localStorage.getItem('userName') || 'Guest';

  // Flows state & loading state
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

  // Create flow using the modal input
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
      // Refresh the flows list
      fetchFlows();
      // Redirect to the editor with the new flow ID
      navigate(`/editor?flow_id=${newFlow.id}`);
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

  // Handle Logout
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
              {/* Logo placeholder */}
              <Icon boxSize={8} viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
                />
              </Icon>
            </Box>
            <HStack spacing={4}>
              <Button leftIcon={<FiSettings />} variant="ghost" size="sm">
                Settings & Members
              </Button>
              {/* Display user name */}
              <Text>{userName}'s workspace</Text>
              <Menu>
                <MenuButton as={Button} rightIcon={<FiChevronDown />} variant="ghost" size="sm">
                  Free
                </MenuButton>
                <MenuList>
                  <MenuItem>Upgrade Plan</MenuItem>
                  <MenuItem>Billing</MenuItem>
                </MenuList>
              </Menu>
              {/* Logout Button */}
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

      {/* Main Content */}
      <Container maxW="1440px" py={8}>
        <Flex gap={6} wrap="wrap">
          {/* Create Flow Card */}
          <Box
            as="button"
            onClick={onOpen}
            w="300px"
            h="200px"
            bg="orange.500"
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

          {/* List existing flows */}
          {loading ? (
            <Spinner size="xl" />
          ) : (
            flows.map((flow) => (
              <Box
                key={flow.id}
                w="300px"
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
                onClick={() => navigate(`/editor?flow_id=${flow.id}`)}
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
      {/* Modal to enter the flow title */}
      <CreateFlowModal isOpen={isOpen} onClose={onClose} onCreate={handleCreateFlow} />
    </Box>
  );
}
