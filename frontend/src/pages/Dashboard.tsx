import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
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
} from '@chakra-ui/react';
import { FiPlus, FiSettings, FiChevronDown, FiLogOut } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { logout } from '../services/authService';
import { getFlows } from '../services/flowService';
import CreateFlowModal from '../components/modal/CreateFlowModal';
import ConfiguracaoModal from "../components/modal/ConfigModal";

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
  const [initialTab, setInitialTab] = useState("config");

  useEffect(() => {
    const fetchFlows = async () => {
      setLoading(true);
      try {
        const data = await getFlows();
        setFlows(data);
      } catch (error) {
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
    fetchFlows();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <Box minH="100vh" bg={bgColor}>
      <Box w="full" py={4} px={6} borderBottom="1px" borderColor={borderColor} bg={cardBg}>
        <Container maxW="1440px">
          <Flex justify="space-between" align="center">
            <Link to="/dashboard">
              <Image
                src="../src/assets/logovendflow.png"
                alt="Logo"
                width={{ base: "40%", md: "20%", lg: "55%" }}
                height="auto"
                align="left"
                marginTop={-2}
                marginBottom={-2}
                marginLeft={-14}
              />
            </Link>
            <HStack spacing={4}>
                    <Button
                    leftIcon={<FiSettings />}
                    variant="solid"
                    size="sm"
                    colorScheme="teal"
                    bg="#2575fc"
                    height={"36px"}
                    _hover={{ bg: "white", color: "#2575fc", border: "1px solid #2575fc" }}
                    _active={{ bg: "white", color: "#2575fc", border: "1px solid #2575fc" }}
                    onClick={() => { setInitialTab("config"); onSettingsOpen(); }}
                    >
                    Configurações e Membros
                    </Button>
              <Menu>
                <MenuButton
                  as={Button}
                  rightIcon={<FiChevronDown />}
                  variant="solid"
                  size="sm"
                  colorScheme="white"
                  bg="#ff9e2c"
                  height={"36px"}
                  _hover={{ bg: "white", color: "#ff9e2c", border: "1px solid #ff9e2c" }}
                  _active={{ bg: "white", color: "#ff9e2c", border: "1px solid #ff9e2c" }}
                >
                  Plano Atual: Gratuito
                </MenuButton>
                <MenuList>
                  <MenuItem onClick={() => { setInitialTab("payment"); onSettingsOpen(); }}>Gratuito</MenuItem>
                </MenuList>
              </Menu>
                <Button
                leftIcon={<FiLogOut />}
                variant="ghost"
                size="sm"
                colorScheme="red"
                onClick={handleLogout}
                border="1px solid"
                borderColor="red.500"
                >
                Logout
                </Button>
            </HStack>
          </Flex>
        </Container>
      </Box>

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
                <Heading size="md" mb={2}>{flow.title}</Heading>
                <Text>{flow.published ? 'Publicado' : 'Rascunho'}</Text>
              </Box>
            ))
          )}
        </Flex>
      </Container>

      <ConfiguracaoModal isOpen={isSettingsOpen} onClose={onSettingsClose} initialTab={initialTab} />
      <CreateFlowModal isOpen={isOpen} onClose={onClose} />
    </Box>
  );
}
