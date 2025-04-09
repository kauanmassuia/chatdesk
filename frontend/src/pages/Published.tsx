"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import { getFlow, updateFlowUrl } from "../services/flowService"
import {
  Box,
  Button,
  Heading,
  useToast,
  Flex,
  Container,
  VStack,
  InputGroup,
  Input,
  InputLeftAddon,
  useColorModeValue,
  HStack,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  Text,
  Icon,
  Badge,
  Card,
  CardBody,
  CardHeader,
} from "@chakra-ui/react"
import { FiLink, FiCopy, FiSave, FiHelpCircle, FiVideo, FiShare2, FiCheckCircle } from "react-icons/fi"
import Header from "../components/Header"
import FaqVideoModal from "../components/modal/FaqVideoModal"

const Published: React.FC = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const toast = useToast()
  const flowParam = searchParams.get("flow_id") || ""
  const uid = flowParam.split("/")[0]
  const [flow, setFlow] = useState<any>(null)
  const [customUrl, setCustomUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const bgColor = useColorModeValue("gray.50", "gray.900")
  const cardBg = useColorModeValue("white", "gray.800")
  const textColor = useColorModeValue("gray.700", "gray.200")
  const borderColor = useColorModeValue("gray.200", "gray.600")
  const accentColor = "#ff9e2c" // Changed to the specified orange color
  const highlightBg = useColorModeValue("#fff5e9", "rgba(255, 158, 44, 0.2)") // Light orange background

  useEffect(() => {
    const fetchFlow = async () => {
      try {
        const data = await getFlow(uid)
        setFlow(data)
        setCustomUrl(data.custom_url)
      } catch (error) {
        console.error("Error fetching flow:", error)
      }
    }
    fetchFlow()
  }, [uid])

  const handleSave = async () => {
    if (/\s/.test(customUrl)) {
      toast({
        title: "Espaço detectado",
        description: "A URL não pode conter espaços.",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
      return
    }

    setIsLoading(true)
    try {
      await updateFlowUrl(uid, customUrl)
      toast({
        title: "Atualização bem-sucedida",
        description: "Sua URL personalizada foi atualizada com sucesso.",
        status: "success",
        duration: 3000,
        isClosable: true,
      })
      setTimeout(() => {
        navigate(`/editor?flow_id=${uid}`)
      }, 100)
    } catch (error) {
      console.error("Error updating custom_url:", error)
      toast({
        title: "Erro na atualização",
        description: "Não foi possível atualizar a URL personalizada.",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Função para abrir o modal em vez de expandir o accordion
  const handleFaqClick = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsModalOpen(true)
  }

  return (
    <Flex direction="column" minH="100vh" bg={bgColor}>
      <Header flowId={uid} />

      <Container maxW="container.lg" pt={{ base: 16, md: 20 }} pb={8}>
        <VStack spacing={6} align="stretch">
          <Card
            variant="outline"
            bg={cardBg}
            borderColor={accentColor}
            borderRadius="lg"
            boxShadow="0 4px 12px rgba(0,0,0,0.05)"
            overflow="hidden"
            mt={2}
            borderWidth="1px"
            position="relative"
          >
            <CardHeader bg={highlightBg} p={0} position="relative">
              <Flex
                bg={highlightBg}
                p={4}
                borderRadius="md"
                align="center"
                justifyContent="space-between"
                borderBottom="1px"
                borderColor="rgba(255, 158, 44, 0.3)"
              >
                <Flex align="center">
                  <Icon as={FiLink} boxSize={5} color={accentColor} mr={3} />
                  <Text fontWeight="medium" color={textColor}>
                    Configure sua URL personalizada
                  </Text>
                </Flex>
                <Badge
                  colorScheme="orange"
                  bg={accentColor}
                  color="white"
                  fontSize="sm"
                  py={1}
                  px={3}
                  borderRadius="full"
                  display="flex"
                  alignItems="center"
                >
                  <Icon as={FiCheckCircle} mr={1} />
                  Publicado
                </Badge>
              </Flex>
            </CardHeader>
            <CardBody p={6}>
              <VStack spacing={6} align="stretch">
                <Box>
                  <Text mb={3} fontWeight="medium" color={textColor}>
                    URL do seu VendFlow:
                  </Text>
                  <Flex direction={{ base: "column", md: "row" }} gap={4} align={{ base: "stretch", md: "flex-start" }}>
                    <InputGroup size="md">
                      <InputLeftAddon
                        children="https://vendflow.com.br/chat/"
                        bg={highlightBg}
                        color={textColor}
                        borderColor="rgba(255, 158, 44, 0.4)"
                      />
                      <Input
                        value={customUrl}
                        onChange={(e) => setCustomUrl(e.target.value)}
                        placeholder="sua-url-personalizada"
                        borderColor="rgba(255, 158, 44, 0.4)"
                        _focus={{ borderColor: accentColor, boxShadow: `0 0 0 1px ${accentColor}` }}
                        _hover={{ borderColor: accentColor }}
                      />
                    </InputGroup>

                    <HStack spacing={3} w={{ base: "100%", md: "auto" }}>
                      <Button
                        bg={accentColor}
                        color="white"
                        onClick={handleSave}
                        isLoading={isLoading}
                        leftIcon={<FiSave />}
                        size="md"
                        w={{ base: "full", md: "auto" }}
                        boxShadow="sm"
                        _hover={{ bg: "#e88e1c", transform: "translateY(-1px)", boxShadow: "md" }}
                        _active={{ bg: "#d68019", transform: "translateY(0)" }}
                        transition="all 0.2s"
                      >
                        Salvar
                      </Button>

                      <Button
                        variant="outline"
                        leftIcon={<FiCopy />}
                        w={{ base: "full", md: "auto" }}
                        borderColor={accentColor}
                        color={accentColor}
                        onClick={() => {
                          navigator.clipboard.writeText(`https://vendflow.com.br/chat/${customUrl}`)
                          toast({
                            title: "Link copiado",
                            description: "O link foi copiado para a área de transferência.",
                            status: "success",
                            duration: 2000,
                            isClosable: true,
                          })
                        }}
                        _hover={{ bg: highlightBg }}
                      >
                        Copiar
                      </Button>
                    </HStack>
                  </Flex>
                </Box>
              </VStack>
            </CardBody>
          </Card>

          <Card
            variant="outline"
            bg={cardBg}
            borderColor={borderColor}
            borderRadius="lg"
            boxShadow="0 4px 12px rgba(0,0,0,0.05)"
            mt={4}
          >
            <CardHeader bg={highlightBg} p={4} borderBottom="1px" borderColor="rgba(255, 158, 44, 0.3)">
              <Heading as="h2" size="md" display="flex" alignItems="center" color={textColor}>
                <Icon as={FiHelpCircle} mr={2} color={accentColor} />
                Perguntas Frequentes
              </Heading>
            </CardHeader>
            <CardBody p={6}>
              <Accordion allowToggle>
                <AccordionItem
                  onClick={handleFaqClick}
                  cursor="pointer"
                  border="1px solid"
                  borderColor={borderColor}
                  borderRadius="md"
                  mb={3}
                  _hover={{ bg: highlightBg }}
                >
                  <h2>
                    <AccordionButton py={3}>
                      <Flex flex="1" textAlign="left" fontWeight="medium" align="center">
                        <Icon as={FiVideo} mr={3} color={accentColor} />
                        Como usar o VendFlow? (Vídeo Tutorial)
                      </Flex>
                      <AccordionIcon color={accentColor} />
                    </AccordionButton>
                  </h2>
                </AccordionItem>

                <AccordionItem
                  onClick={handleFaqClick}
                  cursor="pointer"
                  border="1px solid"
                  borderColor={borderColor}
                  borderRadius="md"
                  mb={3}
                  _hover={{ bg: highlightBg }}
                >
                  <h2>
                    <AccordionButton py={3}>
                      <Flex flex="1" textAlign="left" fontWeight="medium" align="center">
                        <Icon as={FiLink} mr={3} color={accentColor} />
                        Como personalizar minha URL?
                      </Flex>
                      <AccordionIcon color={accentColor} />
                    </AccordionButton>
                  </h2>
                </AccordionItem>

                <AccordionItem
                  onClick={handleFaqClick}
                  cursor="pointer"
                  border="1px solid"
                  borderColor={borderColor}
                  borderRadius="md"
                  _hover={{ bg: highlightBg }}
                >
                  <h2>
                    <AccordionButton py={3}>
                      <Flex flex="1" textAlign="left" fontWeight="medium" align="center">
                        <Icon as={FiShare2} mr={3} color={accentColor} />
                        Como compartilhar meu VendFlow?
                      </Flex>
                      <AccordionIcon color={accentColor} />
                    </AccordionButton>
                  </h2>
                </AccordionItem>
              </Accordion>
            </CardBody>
          </Card>
        </VStack>
      </Container>

      <FaqVideoModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </Flex>
  )
}

export default Published
