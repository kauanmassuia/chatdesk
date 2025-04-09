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
  Divider,
  Card,
  CardBody,
} from "@chakra-ui/react"
import { FiLink, FiCopy, FiSave, FiHelpCircle, FiVideo, FiShare2 } from "react-icons/fi"
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
  const accentColor = useColorModeValue("blue.500", "blue.300")
  const highlightBg = useColorModeValue("blue.50", "blue.900")

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

      {/* Adicionando padding-top extra para evitar sobreposição com o header */}
      <Container maxW="container.lg" pt={{ base: 24, md: 28 }} pb={8}>
        <VStack spacing={8} align="stretch">
          <Box>
            <Flex
              direction={{ base: "column", md: "row" }}
              justify="space-between"
              align={{ base: "flex-start", md: "center" }}
              mb={6}
            >
              <Heading as="h1" size="xl" color={textColor} fontWeight="bold" mb={{ base: 2, md: 0 }}>
                Seu link VendFlow
              </Heading>

              <Badge colorScheme="green" fontSize="md" py={1} px={3} borderRadius="full">
                Publicado
              </Badge>
            </Flex>

            <Text color={textColor} fontSize="lg" mb={8}>
              Personalize e compartilhe seu fluxo de vendas com clientes
            </Text>
          </Box>

          <Card
            variant="outline"
            bg={cardBg}
            borderColor={borderColor}
            borderRadius="lg"
            boxShadow="md"
            overflow="hidden"
          >
            <CardBody p={6}>
              <VStack spacing={6} align="stretch">
                <Flex bg={highlightBg} p={4} borderRadius="md" align="center">
                  <Icon as={FiLink} boxSize={5} color={accentColor} mr={3} />
                  <Text fontWeight="medium">Configure sua URL personalizada abaixo</Text>
                </Flex>

                <Box>
                  <Text mb={2} fontWeight="medium">
                    URL do seu VendFlow:
                  </Text>
                  <Flex direction={{ base: "column", md: "row" }} gap={4} align={{ base: "stretch", md: "flex-start" }}>
                    <InputGroup size="md">
                      <InputLeftAddon children="https://vendflow.com.br/chat/" />
                      <Input
                        value={customUrl}
                        onChange={(e) => setCustomUrl(e.target.value)}
                        placeholder="sua-url-personalizada"
                        borderColor={borderColor}
                        _focus={{ borderColor: accentColor, boxShadow: `0 0 0 1px ${accentColor}` }}
                      />
                    </InputGroup>

                    <HStack spacing={3} w={{ base: "100%", md: "auto" }}>
                      <Button
                        colorScheme="blue"
                        onClick={handleSave}
                        isLoading={isLoading}
                        leftIcon={<FiSave />}
                        size="md"
                        w={{ base: "full", md: "auto" }}
                        boxShadow="sm"
                        _hover={{ transform: "translateY(-1px)", boxShadow: "md" }}
                        _active={{ transform: "translateY(0)" }}
                        transition="all 0.2s"
                      >
                        Salvar
                      </Button>

                      <Button
                        variant="outline"
                        leftIcon={<FiCopy />}
                        w={{ base: "full", md: "auto" }}
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
                        _hover={{ bg: "gray.50" }}
                      >
                        Copiar
                      </Button>
                    </HStack>
                  </Flex>
                </Box>

                <Divider />

                <Box>
                  <Text fontWeight="medium" mb={2}>
                    Compartilhe seu VendFlow:
                  </Text>
                  <HStack spacing={3}>
                    <Button
                      leftIcon={<FiShare2 />}
                      colorScheme="green"
                      variant="solid"
                      size="sm"
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
                    >
                      Compartilhar
                    </Button>
                  </HStack>
                </Box>
              </VStack>
            </CardBody>
          </Card>

          <Card variant="outline" bg={cardBg} borderColor={borderColor} borderRadius="lg" boxShadow="md" mt={6}>
            <CardBody p={6}>
              <Heading as="h2" size="lg" mb={4} display="flex" alignItems="center">
                <Icon as={FiHelpCircle} mr={2} color={accentColor} />
                Perguntas Frequentes
              </Heading>

              <Accordion allowToggle>
                <AccordionItem
                  onClick={handleFaqClick}
                  cursor="pointer"
                  border="1px solid"
                  borderColor={borderColor}
                  borderRadius="md"
                  mb={3}
                  _hover={{ bg: "gray.50" }}
                >
                  <h2>
                    <AccordionButton py={3}>
                      <Flex flex="1" textAlign="left" fontWeight="medium" align="center">
                        <Icon as={FiVideo} mr={3} color={accentColor} />
                        Como usar o VendFlow? (Vídeo Tutorial)
                      </Flex>
                      <AccordionIcon />
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
                  _hover={{ bg: "gray.50" }}
                >
                  <h2>
                    <AccordionButton py={3}>
                      <Flex flex="1" textAlign="left" fontWeight="medium" align="center">
                        <Icon as={FiLink} mr={3} color={accentColor} />
                        Como personalizar minha URL?
                      </Flex>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                </AccordionItem>

                <AccordionItem
                  onClick={handleFaqClick}
                  cursor="pointer"
                  border="1px solid"
                  borderColor={borderColor}
                  borderRadius="md"
                  _hover={{ bg: "gray.50" }}
                >
                  <h2>
                    <AccordionButton py={3}>
                      <Flex flex="1" textAlign="left" fontWeight="medium" align="center">
                        <Icon as={FiShare2} mr={3} color={accentColor} />
                        Como compartilhar meu VendFlow?
                      </Flex>
                      <AccordionIcon />
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
