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
  Text,
  useColorModeValue,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  VStack,
  Divider,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react'
import { FiPlus, FiSettings, FiChevronDown, FiFolderPlus, FiUser, FiCreditCard } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
  const navigate = useNavigate()
  const bgColor = useColorModeValue('gray.50', 'gray.900')
  const cardBg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  const { isOpen, onOpen, onClose } = useDisclosure()
  
  // Dados do plano (simulados)
  const planoUsuario = "Starter";
  const limiteConversas = 5000;
  const conversasUsadas = 10;
  const porcentagemUso = ((conversasUsadas / limiteConversas) * 100).toFixed(1);
  const corBarra = parseFloat(porcentagemUso) < 70 ? "green.400" : 
                  parseFloat(porcentagemUso) < 90 ? "yellow.400" : "red.400";

  const handleCreateBot = () => {
    navigate('/create-typebot')
  }

  return (
    <Box minH="100vh" bg={bgColor}>
      {/* Cabeçalho */}
      <Box
        w="full"
        py={4}
        px={6}
        borderBottom="1px"
        borderColor={borderColor}
        bg={cardBg}
      >
        <Container maxW="1440px">
          <Flex justify="space-between" align="center">
            <Box>
              <Icon boxSize={8} viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
                />
              </Icon>
            </Box>
            <HStack spacing={4}>
              <Button leftIcon={<FiSettings />} variant="ghost" size="sm" onClick={onOpen}>
                Configurações e Membros
              </Button>
              <Text>Espaço de trabalho de Kauan Massuia</Text>
              <Menu>
                <MenuButton as={Button} rightIcon={<FiChevronDown />} variant="ghost" size="sm">
                  Gratuito
                </MenuButton>
                <MenuList>
                  <MenuItem>Atualizar Plano</MenuItem>
                  <MenuItem>Faturamento</MenuItem>
                </MenuList>
              </Menu>
            </HStack>
          </Flex>
        </Container>
      </Box>

      {/* Conteúdo Principal */}
      <Container maxW="1440px" py={8}>
        <HStack mb={8} spacing={4}>
          <Button leftIcon={<FiFolderPlus />} variant="outline" size="sm">
            Criar uma pasta
          </Button>
        </HStack>

        <Flex gap={6} wrap="wrap">
          {/* Card para Criar Bot */}
          <Box
            as="button"
            onClick={handleCreateBot}
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
            <Heading size="md">Criar um typebot</Heading>
          </Box>
        </Flex>
      </Container>

      {/* Modal - Configurações e Membros */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg" zIndex={1500}>
        <ModalOverlay />
        <ModalContent borderRadius="lg" maxW="800px" minH="80vh" zIndex={1600}>
          <ModalHeader>Configurações e Membros</ModalHeader>
          <ModalCloseButton />
          
          <ModalBody>
            <Flex>
                            {/* Barra Lateral */}
              <VStack spacing={4} align="start" w="200px" borderRight="1px" borderColor="gray.200" pr={4}>
                <Button leftIcon={<FiUser />} variant="ghost" w="full" justifyContent="flex-start">
                  Perfil
                </Button>
                <Button leftIcon={<FiCreditCard />} variant="ghost" w="full" justifyContent="flex-start">
                  Faturamento
                </Button>
                <Button 
                  leftIcon={<FiSettings />} 
                  variant="ghost" 
                  w="full" 
                  justifyContent="flex-start"
                  h="auto"
                  py={2}
                  textAlign="left"
                >
                  <Text lineHeight="shorter" textAlign="left">
                    Configurações<br />
                    do Plano
                  </Text>
                </Button>
                <Divider my={4} />
                <Button leftIcon={<FiUser />} variant="ghost" w="full" justifyContent="flex-start">
                  Gerenciar Membros
                </Button>
              </VStack>
              
              {/* Conteúdo Principal do Modal */}
              <Box flex="1" pl={4}>
                {/* Informações do Plano */}
                <Box mb={6}>
                  <Text fontSize="md" mb={2}>📊 Conversas usadas: <strong>{conversasUsadas} / {limiteConversas}</strong></Text>
                  
                  {/* Barra de Progresso */}
                  <Box mb={4}>
                    <Flex justify="space-between" mb={1}>
                      <Text fontSize="sm">Uso do plano: <strong>{porcentagemUso}%</strong></Text>
                      <Text fontSize="sm">Plano {planoUsuario}</Text>
                    </Flex>
                    <Box
                      w="100%"
                      bg="gray.100"
                      borderRadius="full"
                      h="8px"
                      overflow="hidden"
                    >
                      <Box
                        w={`${porcentagemUso}%`}
                        bg={corBarra}
                        h="100%"
                        borderRadius="full"
                        transition="width 0.5s ease-in-out"
                      />
                    </Box>
                  </Box>
                  
                  <Text fontSize="md" mb={2}>🗓️ Renova em: <strong>19/04/2025</strong></Text>
                  <Text fontSize="md" mb={4}>💼 Assinatura atual: <strong>Plano {planoUsuario}</strong></Text>
                </Box>

                {/* Comparativo de Planos */}
                <Box>
                  <Text fontSize="lg" fontWeight="bold" mb={4}>Comparativo de Planos</Text>
                  <Flex gap={4} wrap="wrap">
                    {/* Starter */}
                    <Box flex="1" minW="250px" p={4} border="1px" borderColor="gray.300" rounded="md">
                      <Heading fontSize="md" color="orange.500" mb={1}>Plano Starter</Heading>
                      <Text fontSize="sm" color="gray.600">Para indivíduos e pequenos negócios</Text>
                      <Text mt={3}>💰 <strong>R$97,00/mês</strong></Text>
                      <Text>👥 1 Acesso Incluído</Text>
                    </Box>

                    {/* Pro */}
                    <Box flex="1" minW="250px" p={4} border="1px" borderColor="gray.300" rounded="md">
                      <Heading fontSize="md" color="purple.600" mb={1}>Plano Pro</Heading>
                      <Text fontSize="sm" color="gray.600">Para agências e startups em crescimento</Text>
                      <Text mt={3}>💰 <strong>R$197,00/mês</strong></Text>
                      <Text>👥 3 Acessos Incluídos</Text>
                    </Box>
                  </Flex>
                </Box>
              </Box>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  )
}
