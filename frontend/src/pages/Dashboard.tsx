"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
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
  Grid,
  Badge,
  Divider,
  VStack,
  Card,
  CardBody,
  IconButton,
} from "@chakra-ui/react"
import {
  FiPlus,
  FiSettings,
  FiChevronDown,
  FiLogOut,
  FiClock,
  FiCheckCircle,
  FiCalendar,
  FiMoreVertical,
  FiCopy,
  FiTrash2,
  FiEyeOff,
} from "react-icons/fi"
import { useNavigate } from "react-router-dom"
import { logout } from "../services/authService"
import { getFlows, createFlow } from "../services/flowService"
import CreateFlowModal from "../components/modal/CreateFlowModal"
import ConfiguracaoModal from "../components/modal/ConfigModal"
import logoImage from '../assets/logovendflow.png'

export default function Dashboard() {
  const navigate = useNavigate()
  const bgColor = useColorModeValue("gray.50", "gray.900")
  const cardBg = useColorModeValue("white", "gray.800")
  const borderColor = useColorModeValue("gray.200", "gray.700")
  const headingColor = useColorModeValue("gray.800", "white")
  const subTextColor = useColorModeValue("gray.600", "gray.400")
  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { isOpen: isSettingsOpen, onOpen: onSettingsOpen, onClose: onSettingsClose } = useDisclosure()

  const userName = localStorage.getItem("userName") || "Guest"
  const [flows, setFlows] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [initialTab, setInitialTab] = useState("config")

  // Color scheme
  const accentColor = "#ff9e2c"
  const blueColor = "#2575fc"
  const highlightBg = useColorModeValue("#fff5e9", "rgba(255, 158, 44, 0.2)")

  const fetchFlows = async () => {
    setLoading(true)
    try {
      const data = await getFlows()
      setFlows(data)
    } catch (error) {
      console.error("Error fetching flows:", error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar os flows.",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFlows()
  }, [])

  // Create flow using the modal input
  const handleCreateFlow = async (title: string) => {
    try {
      const newFlow = await createFlow(title, {})
      toast({
        title: "Flow criado",
        description: "Flow criado com sucesso. Redirecionando para o editor...",
        status: "success",
        duration: 3000,
        isClosable: true,
      })
      // Refresh the flows list
      fetchFlows()
      // Redirect to the editor with the new flow ID
      // navigate(`/editor?flow_id=${newFlow.uid}`);
    } catch (error) {
      console.error("Error creating flow:", error)
      toast({
        title: "Erro",
        description: "Houve um erro ao criar o flow. Tente novamente.",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
    }
  }

  const handleLogout = async () => {
    await logout()
    navigate("/login")
  }

  // Handle flow actions
  const handleDuplicate = (flowId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    toast({
      title: "Duplicando flow",
      description: "Funcionalidade em desenvolvimento",
      status: "info",
      duration: 3000,
      isClosable: true,
    })
  }

  const handleUnpublish = (flowId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    toast({
      title: "Despublicando flow",
      description: "Funcionalidade em desenvolvimento",
      status: "info",
      duration: 3000,
      isClosable: true,
    })
  }

  const handleDelete = (flowId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    toast({
      title: "Excluindo flow",
      description: "Funcionalidade em desenvolvimento",
      status: "info",
      duration: 3000,
      isClosable: true,
    })
  }

  return (
    <Box minH="100vh" bg={bgColor}>
      {/* Header with shadow for depth */}
      <Box
        w="full"
        py={4}
        px={6}
        borderBottom="1px"
        borderColor={borderColor}
        bg={cardBg}
        position="sticky"
        top="0"
        zIndex="sticky"
        boxShadow="0 2px 10px rgba(0,0,0,0.05)"
      >
        <Container maxW="1440px">
          <Flex justify="space-between" align="center">
            <Link to="/dashboard">
              <Image
                src={logoImage}
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
                bg={blueColor}
                color="white"
                height={"36px"}
                boxShadow="md"
                _hover={{
                  bg: "white",
                  color: blueColor,
                  border: "1px solid",
                  borderColor: blueColor,
                  transform: "translateY(-2px)",
                  boxShadow: "lg",
                }}
                _active={{
                  bg: "white",
                  color: blueColor,
                  border: "1px solid",
                  borderColor: blueColor,
                  transform: "translateY(0px)",
                }}
                transition="all 0.2s"
                onClick={() => {
                  setInitialTab("config")
                  setTimeout(() => {
                    onSettingsOpen()
                  }, 0)
                }}
              >
                Configurações e Membros
              </Button>
              <Menu>
                <MenuButton
                  as={Button}
                  rightIcon={<FiChevronDown />}
                  variant="solid"
                  size="sm"
                  bg={accentColor}
                  color="white"
                  height={"36px"}
                  boxShadow="md"
                  _hover={{
                    bg: "white",
                    color: accentColor,
                    border: "1px solid",
                    borderColor: accentColor,
                    transform: "translateY(-2px)",
                    boxShadow: "lg",
                  }}
                  _active={{
                    bg: "white",
                    color: accentColor,
                    border: "1px solid",
                    borderColor: accentColor,
                    transform: "translateY(0px)",
                  }}
                  transition="all 0.2s"
                >
                  Plano Atual: Gratuito
                </MenuButton>
                <MenuList boxShadow="lg" borderColor={borderColor}>
                  <MenuItem
                    onClick={() => {
                      setInitialTab("payment")
                      setTimeout(() => {
                        onSettingsOpen()
                      }, 0)
                    }}
                    _hover={{ bg: highlightBg }}
                  >
                    Gratuito
                  </MenuItem>
                </MenuList>
              </Menu>
              <Button
                leftIcon={<FiLogOut />}
                variant="outline"
                size="sm"
                colorScheme="red"
                onClick={handleLogout}
                border="1px solid"
                borderColor="red.500"
                _hover={{
                  bg: "red.50",
                  transform: "translateY(-2px)",
                  boxShadow: "md",
                }}
                _active={{
                  bg: "red.100",
                  transform: "translateY(0px)",
                }}
                transition="all 0.2s"
              >
                Logout
              </Button>
            </HStack>
          </Flex>
        </Container>
      </Box>

      <Container maxW="1440px" py={8}>
        <VStack spacing={6} align="stretch">
          <Grid
            templateColumns={{
              base: "repeat(1, 1fr)",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
              lg: "repeat(4, 1fr)",
            }}
            gap={6}
            mt={4}
          >
            <Box
              as="button"
              onClick={onOpen}
              h="220px"
              bg={accentColor}
              color="white"
              borderRadius="xl"
              p={6}
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              boxShadow="0 4px 12px rgba(255, 158, 44, 0.3)"
              _hover={{
                transform: "translateY(-5px)",
                boxShadow: "0 8px 16px rgba(255, 158, 44, 0.4)",
                bg: "#e88e1c",
              }}
              _active={{
                transform: "translateY(-2px)",
                boxShadow: "0 4px 8px rgba(255, 158, 44, 0.3)",
                bg: "#d68019",
              }}
              transition="all 0.3s"
              position="relative"
              overflow="hidden"
            >
              <Icon as={FiPlus} boxSize={10} mb={4} />
              <Heading size="md" fontWeight="bold">
                Crie um Flow
              </Heading>
              <Text mt={2} fontSize="sm" opacity={0.9}>
                Comece um novo projeto
              </Text>
            </Box>

            {loading ? (
              <Flex h="220px" justify="center" align="center" bg={cardBg} borderRadius="xl" boxShadow="md">
                <Spinner size="xl" thickness="4px" speed="0.65s" color={accentColor} />
              </Flex>
            ) : (
              flows.map((flow) => (
                <Card
                  key={flow.id}
                  h="220px"
                  bg={cardBg}
                  borderColor={borderColor}
                  borderRadius="xl"
                  boxShadow="0 4px 12px rgba(0,0,0,0.05)"
                  _hover={{
                    transform: "translateY(-5px)",
                    boxShadow: "0 8px 16px rgba(0,0,0,0.08)",
                    borderColor: accentColor,
                  }}
                  _active={{
                    transform: "translateY(-2px)",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.06)",
                  }}
                  transition="all 0.3s"
                  onClick={() => navigate(`/editor?flow_id=${flow.uid}`)}
                  cursor="pointer"
                  overflow="hidden"
                  position="relative"
                >
                  <CardBody p={6} display="flex" flexDirection="column" justifyContent="space-between" h="100%">
                    {/* Top row with badge and menu */}
                    <Flex justify="space-between" align="center">
                      <Badge
                        bg={flow.published ? accentColor : "gray.200"}
                        color={flow.published ? "white" : "gray.600"}
                        borderRadius="full"
                        px={1.5}
                        py={0.5}
                        display="flex"
                        alignItems="center"
                        fontWeight="medium"
                        fontSize="xs"
                      >
                        <Icon as={flow.published ? FiCheckCircle : FiClock} mr={1} boxSize={3} />
                        {flow.published ? "Publicado" : "Rascunho"}
                      </Badge>
                      <Menu isLazy>
                        <MenuButton
                          as={IconButton}
                          aria-label="Opções"
                          icon={<FiMoreVertical />}
                          variant="ghost"
                          size="sm"
                          onClick={(e) => e.stopPropagation()}
                          _hover={{ bg: highlightBg }}
                        />
                        <MenuList onClick={(e) => e.stopPropagation()}>
                          <MenuItem icon={<FiCopy />} onClick={(e) => handleDuplicate(flow.uid, e)}>
                            Duplicar
                          </MenuItem>
                          <MenuItem
                            icon={<FiEyeOff />}
                            onClick={(e) => handleUnpublish(flow.uid, e)}
                            isDisabled={!flow.published}
                          >
                            Despublicar
                          </MenuItem>
                          <MenuItem icon={<FiTrash2 />} onClick={(e) => handleDelete(flow.uid, e)} color="red.500">
                            Excluir
                          </MenuItem>
                        </MenuList>
                      </Menu>
                    </Flex>

                    {/* Perfectly centered flow title */}
                    <Flex flex="1" justify="center" align="center">
                      <Heading size="md" textAlign="center" color={headingColor} noOfLines={2}>
                        {flow.title}
                      </Heading>
                    </Flex>

                    <Box>
                      <Divider my={3} borderColor="rgba(255, 158, 44, 0.2)" />
                      <Flex align="center" fontSize="xs" color={subTextColor} pl={1}>
                        <Icon as={FiCalendar} mr={1} color={accentColor} />
                        <Text>Atualizado hoje</Text>
                      </Flex>
                    </Box>
                  </CardBody>
                </Card>
              ))
            )}
          </Grid>
        </VStack>
      </Container>

      <ConfiguracaoModal isOpen={isSettingsOpen} onClose={onSettingsClose} initialTab={initialTab} />
      <CreateFlowModal isOpen={isOpen} onClose={onClose} onCreate={handleCreateFlow} />
    </Box>
  )
}
