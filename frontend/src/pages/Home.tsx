"use client"

import { useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import {
  Box,
  Button,
  Container,
  Flex,
  Grid,
  Heading,
  HStack,
  Icon,
  IconButton,
  Image,
  Link,
  SimpleGrid,
  Text,
  useDisclosure,
  VStack,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useBreakpointValue,
  Card,
  Divider,
  useColorModeValue,
} from "@chakra-ui/react"
import {
  FiArrowRight,
  FiMessageSquare,
  FiBarChart2,
  FiCopy,
  FiMessageCircle,
  FiClock,
  FiUsers,
  FiMenu,
  FiCheck,
} from "react-icons/fi"
import PricingSection from "../components/PricingSection"
import logoImage from '../assets/logovendflow.png'

export default function Home() {
  const navigate = useNavigate()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const btnRef = useRef<HTMLButtonElement>(null)

  const goToLogin = () => {
    navigate("/login")
  }

  const goToDashboard = () => {
    navigate("/dashboard")
  }

  // Cores principais - Updated with new colors
  const bgGradient = useColorModeValue(
    "linear(to-b, #f0f7ff, #fff5eb)",
    "linear(to-b, gray.900, #2d1a08)"
  )
  const cardBg = useColorModeValue("white", "gray.800")
  const textColor = useColorModeValue("gray.700", "gray.200")
  const headingColor = useColorModeValue("gray.800", "white")
  const accentColor = useColorModeValue("#2563eb", "#4f83f1") // Updated blue
  const accentOrange = useColorModeValue("#ff9e2c", "#ff9e2c") // New orange accent

  useEffect(() => {
    const counters = document.querySelectorAll(".count")
    const duration = 2000 // 2 segundos de duração
    const easeOutQuad = (t: number): number => t * (2 - t)

    const animateCounters = () => {
      counters.forEach((counter) => {
        const target = Number.parseInt(counter.getAttribute("data-val") || "0", 10)
        let current = 0
        const increment = 1000 // Contar sempre de mil em mil

        const updateCounter = (timestamp: number, start: number): void => {
          const progress = Math.min((timestamp - start) / duration, 1)
          const eased = easeOutQuad(progress)

          // Atualiza a contagem de mil em mil
          current = Math.min(Math.floor(eased * target), target)

          // Formatar o número
          counter.textContent = current.toLocaleString()

          if (progress < 1) {
            requestAnimationFrame((timestamp) => updateCounter(timestamp, start))
          } else {
            // Adiciona o sufixo apropriado após a contagem terminar
            if (counter.classList.contains("count-mil")) {
              counter.textContent = `+${target}mil`
            } else if (counter.classList.contains("count-percent")) {
              counter.textContent = `+${target}%`
            } else {
              counter.textContent = `+${target}`
            }
          }
        }

        // Inicia a animação
        const startAnimation = () => {
          const step = (timestamp: number) => {
            const start: number = timestamp
            updateCounter(timestamp, start)
          }

          requestAnimationFrame(step)
        }

        startAnimation()
      })
    }

    // Observer para detectar quando a seção estiver visível
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          animateCounters()
          observer.disconnect() // Desconectar após a animação
        }
      },
      { threshold: 0.5 }, // Verifica quando pelo menos 50% do elemento estiver visível
    )

    const statsElement = document.querySelector(".stats")
    if (statsElement) {
      observer.observe(statsElement)
    }

    return () => observer.disconnect() // Limpar quando o componente for desmontado
  }, [])

  const isDesktop = useBreakpointValue({ base: false, md: true })

  return (
    <Box bgGradient={bgGradient} minH="100vh">
      {/* Header */}
      <Box
        as="header"
        position="sticky"
        top="0"
        zIndex="sticky"
        bg={useColorModeValue("rgba(255, 255, 255, 0.9)", "rgba(26, 32, 44, 0.9)")}
        backdropFilter="blur(10px)"
        boxShadow="sm"
        py={3}
      >
        <Container maxW="container.xl">
          <Flex justify="space-between" align="center">
            <Image src={logoImage} alt="VendFlow Logo" h={{ base: "40px", md: "48px", lg: "68px" }} ml={"-70px"} />

            {isDesktop ? (
              <HStack spacing={8}>
                <Link href="#funcionalidades" fontWeight="medium" color={textColor} _hover={{ color: accentColor }}>
                  Funcionalidades
                </Link>
                <Link href="#preco" fontWeight="medium" color={textColor} _hover={{ color: accentColor }}>
                  Preço
                </Link>
                <Link href="#contato" fontWeight="medium" color={textColor} _hover={{ color: accentColor }}>
                  Contato
                </Link>
                <Button
                  onClick={goToDashboard}
                  bg="#2563eb"
                  color="white"
                  rounded="full"
                  size="md"
                  _hover={{ transform: "scale(1.05)", bg: "#ff9e2c" }}
                  transition="all 0.3s ease"
                >
                  Comecar Agora
                </Button>
              </HStack>
            ) : (
              <IconButton ref={btnRef} aria-label="Menu" icon={<FiMenu />} variant="ghost" onClick={onOpen} />
            )}
          </Flex>
        </Container>
      </Box>

      {/* Mobile Menu Drawer */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose} finalFocusRef={btnRef}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Menu</DrawerHeader>
          <DrawerBody>
            <VStack spacing={4} align="stretch" mt={4}>
              <Link href="#funcionalidades" fontWeight="medium" onClick={onClose}>
                Funcionalidades
              </Link>
              <Link href="#preco" fontWeight="medium" onClick={onClose}>
                Preço
              </Link>
              <Link href="#contato" fontWeight="medium" onClick={onClose}>
                Contato
              </Link>
              <Button
                onClick={() => {
                  goToDashboard()
                  onClose()
                }}
                bg="#2563eb"
                color="white"
                rounded="full"
                size="md"
                mt={2}
              >
                Acessar Dashboard
              </Button>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* Hero Section */}
      <Box
        as="section"
        position="relative"
        bgGradient="linear(to-r, #e6f0ff, #fff0e0)"
        py={{ base: 16, md: 28 }}
        overflow="hidden"
      >
        <Container maxW="full">
          <VStack spacing={6} textAlign="center" maxW="80%" mx="auto">
            <Heading
              as="h1"
              size={{ base: "2xl", md: "3xl", lg: "4xl" }}
              fontWeight="bold"
              lineHeight="shorter"
              color={headingColor}
            >
              Crie Chatbots Automáticos e Melhore a Experiência do Cliente
            </Heading>
            <Text fontSize={{ base: "lg", md: "xl" }} color={textColor} padding={"3%"}>
              Crie e implemente chatbots inteligentes para um atendimento rápido, escalável e preciso.
            </Text>
            <Button
              onClick={goToLogin}
              bg="#2563eb"
              color="white"
              size="lg"
              rounded="full"
              px={8}
              py={7}
              fontSize="lg"
              shadow="md"
              _hover={{ transform: "scale(1.05)", shadow: "lg", bg: "#f08c1a" }}
              transition="all 0.3s ease"
            >
              Assinar agora
            </Button>
          </VStack>
        </Container>
        <Box position="absolute" bottom="-10" left="0" right="0" height="80px" bg={cardBg} transform="skewY(3deg)" />
      </Box>

      {/* Stats Section */}
      <Box as="section" className="stats" py={{ base: 16, md: 24 }}>
        <Container maxW="container.xl">
          <Heading as="h2" size="xl" textAlign="center" mb={12} color={headingColor}>
            Veja nossos números
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} maxW="4xl" mx="auto">
            <Card
              bg={cardBg}
              rounded="xl"
              shadow="md"
              p={8}
              textAlign="center"
              _hover={{ transform: "scale(1.05)", shadow: "lg" }}
              transition="all 0.3s ease"
            >
              <Text
                className="count count-mil"
                data-val="68"
                fontSize={{ base: "4xl", md: "5xl" }}
                fontWeight="bold"
                color={accentColor}
                mb={2}
              >
                0
              </Text>
              <Text fontSize="lg" color={textColor}>
                Conversas Registradas
              </Text>
            </Card>
            <Card
              bg={cardBg}
              rounded="xl"
              shadow="md"
              p={8}
              textAlign="center"
              _hover={{ transform: "scale(1.05)", shadow: "lg" }}
              transition="all 0.3s ease"
            >
              <Text
                className="count count-percent"
                data-val="99"
                fontSize={{ base: "4xl", md: "5xl" }}
                fontWeight="bold"
                color="#2563eb"
                mb={2}
              >
                0
              </Text>
              <Text fontSize="lg" color={textColor}>
                Aumento na satisfação
              </Text>
            </Card>
            <Card
              bg={cardBg}
              rounded="xl"
              shadow="md"
              p={8}
              textAlign="center"
              _hover={{ transform: "scale(1.05)", shadow: "lg" }}
              transition="all 0.3s ease"
            >
              <Text
                className="count"
                data-val="78"
                fontSize={{ base: "4xl", md: "5xl" }}
                fontWeight="bold"
                color={accentColor}
                mb={2}
              >
                0
              </Text>
              <Text fontSize="lg" color={textColor}>
                Empresas utilizam diariamente
              </Text>
            </Card>
          </SimpleGrid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box as="section" id="funcionalidades" py={{ base: 16, md: 24 }} bgGradient="linear(to-b, #f8fafc, white)">
        <Container maxW="container.xl">
          <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={12} alignItems="center" mb={24}>
            <Box
              rounded="2xl"
              overflow="hidden"
              shadow="xl"
              _hover={{ transform: "scale(1.05)" }}
              transition="transform 0.3s ease"
            >
              <Box as="video" w="full" h="auto" autoPlay loop muted playsInline>
                <source src="/src/assets/videocomofuncionaflow.mp4" type="video/mp4" />
                Seu navegador não suporta vídeos.
              </Box>
            </Box>
            <VStack align="start" spacing={6}>
              <Heading as="h2" size={{ base: "xl", md: "2xl" }} color={headingColor}>
                Construa Bots com Simples Arrastar e Soltar
              </Heading>
              <Text fontSize="lg" color={textColor}>
                Crie chatbots personalizados com facilidade! Com apenas um arrastar de blocos, você define de forma
                intuitiva o caminho que o seu bot seguirá, criando interações inteligentes e eficientes. Sem código, sem
                complicação. O controle está em suas mãos!
              </Text>
              <Button
                onClick={goToLogin}
                variant="link"
                color="#2563eb"
                rightIcon={<FiArrowRight />}
                fontWeight="medium"
                fontSize="lg"
              >
                Leia o Docs
              </Button>
            </VStack>
          </Grid>

          <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={12} alignItems="center" mb={24}>
            <VStack align="start" spacing={6} order={{ base: 2, md: 1 }}>
              <Heading as="h2" size={{ base: "xl", md: "2xl" }} color={headingColor}>
                Importe e Exporte Templates Prontos
              </Heading>
              <Text fontSize="lg" color={textColor}>
                Acelere o seu processo de criação com templates prontos! Importe e exporte facilmente funis de vendas,
                respostas automáticas e fluxos de atendimento já validados no mercado. Economize tempo e use modelos que
                já foram testados e aprovados, garantindo resultados eficazes desde o primeiro momento.
              </Text>
              <Button
                onClick={goToLogin}
                variant="link"
                color="#2563eb"
                rightIcon={<FiArrowRight />}
                fontWeight="medium"
                fontSize="lg"
              >
                Leia o Docs
              </Button>
            </VStack>
            <Box
              rounded="2xl"
              overflow="hidden"
              shadow="xl"
              order={{ base: 1, md: 2 }}
              _hover={{ transform: "scale(1.05)" }}
              transition="transform 0.3s ease"
            >
              <Flex bgGradient="linear(to-r, #e6f0ff, #fff0e0)" h="320px" align="center" justify="center">
                <Icon as={FiCopy} w={24} h={24} color="#ff9e2c" />
              </Flex>
            </Box>
          </Grid>

          <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={12} alignItems="center">
            <Box
              rounded="2xl"
              overflow="hidden"
              shadow="xl"
              _hover={{ transform: "scale(1.05)" }}
              transition="transform 0.3s ease"
            >
              <Flex bgGradient="linear(to-r, #e6f0ff, #fff0e0)" h="320px" align="center" justify="center">
                <Icon as={FiBarChart2} w={24} h={24} color="#2563eb" />
              </Flex>
            </Box>
            <VStack align="start" spacing={6}>
              <Heading as="h2" size={{ base: "xl", md: "2xl" }} color={headingColor}>
                Mais do que apenas um Bot: Análise de Performance para o Crescimento
              </Heading>
              <Text fontSize="lg" color={textColor}>
                Acompanhe o desempenho do seu chatbot em tempo real e otimize sua estratégia com nossas poderosas
                ferramentas de análise. Acesse métricas detalhadas como taxas de desistência, conclusão de fluxos e
                engajamento, permitindo que você tome decisões informadas para melhorar a experiência do cliente. Use
                esses insights para refinar seu atendimento e impulsionar o crescimento do seu negócio.
              </Text>
              <Button
                onClick={goToLogin}
                variant="link"
                color="#2563eb"
                rightIcon={<FiArrowRight />}
                fontWeight="medium"
                fontSize="lg"
              >
                Leia o Docs
              </Button>
            </VStack>
          </Grid>
        </Container>
      </Box>

      {/* More Features Section */}
      <Box as="section" py={{ base: 16, md: 24 }} bgGradient="linear(to-b, white, #f8fafc)">
        <Container maxW="container.xl">
          <VStack spacing={4} textAlign="center" mb={16}>
            <Heading as="h2" size={{ base: "xl", md: "2xl" }} color={headingColor}>
              Mais funcionalidades para facilitar sua vida
            </Heading>
            <Text fontSize="xl" color={textColor} maxW="2xl" mx="auto">
              Além de gerenciar criar fluxos, o VendFlow oferece:
            </Text>
          </VStack>

          <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} spacing={8} maxW="6xl" mx="auto">
            <Card
              bg={cardBg}
              rounded="xl"
              shadow="md"
              p={8}
              _hover={{ transform: "scale(1.05)", shadow: "lg" }}
              transition="all 0.3s ease"
              borderTop="4px solid #ff9e2c"
            >
              <Icon as={FiMessageSquare} w={12} h={12} color="#ff9e2c" mb={4} />
              <Heading as="h3" size="md" mb={3} color={headingColor}>
                Automação de respostas
              </Heading>
              <Text color={textColor}>
                Configure respostas automáticas para perguntas frequentes e economize tempo da sua equipe.
              </Text>
            </Card>
            <Card
              bg={cardBg}
              rounded="xl"
              shadow="md"
              p={8}
              _hover={{ transform: "scale(1.05)", shadow: "lg" }}
              transition="all 0.3s ease"
              borderTop="4px solid #2563eb"
            >
              <Icon as={FiBarChart2} w={12} h={12} color="#2563eb" mb={4} />
              <Heading as="h3" size="md" mb={3} color={headingColor}>
                Relatórios detalhados
              </Heading>
              <Text color={textColor}>
                Visualize relatórios de desempenho, tempo de resposta e satisfação do cliente.
              </Text>
            </Card>
            <Card
              bg={cardBg}
              rounded="xl"
              shadow="md"
              p={8}
              _hover={{ transform: "scale(1.05)", shadow: "lg" }}
              transition="all 0.3s ease"
              borderTop="4px solid #ff9e2c"
            >
              <Icon as={FiCopy} w={12} h={12} color="#ff9e2c" mb={4} />
              <Heading as="h3" size="md" mb={3} color={headingColor}>
                Importação e Exportação de templates
              </Heading>
              <Text color={textColor}>
                Importe templates prontos e exporte para compartilhar com usuários da plataforma quando quiser!
              </Text>
            </Card>
            <Card
              bg={cardBg}
              rounded="xl"
              shadow="md"
              p={8}
              _hover={{ transform: "scale(1.05)", shadow: "lg" }}
              transition="all 0.3s ease"
              borderTop="4px solid #2563eb"
            >
              <Icon as={FiMessageCircle} w={12} h={12} color="#2563eb" mb={4} />
              <Heading as="h3" size="md" mb={3} color={headingColor}>
                Chatbot personalizado
              </Heading>
              <Text color={textColor}>Crie fluxos de atendimento automatizados para resolver problemas comuns.</Text>
            </Card>
            <Card
              bg={cardBg}
              rounded="xl"
              shadow="md"
              p={8}
              _hover={{ transform: "scale(1.05)", shadow: "lg" }}
              transition="all 0.3s ease"
              borderTop="4px solid #ff9e2c"
            >
              <Icon as={FiClock} w={12} h={12} color="#ff9e2c" mb={4} />
              <Heading as="h3" size="md" mb={3} color={headingColor}>
                Suporte 24/7
              </Heading>
              <Text color={textColor}>Obtenha sugestões de respostas e análise de sentimento em tempo real 24/7.</Text>
            </Card>
            <Card
              bg={cardBg}
              rounded="xl"
              shadow="md"
              p={8}
              _hover={{ transform: "scale(1.05)", shadow: "lg" }}
              transition="all 0.3s ease"
              borderTop="4px solid #2563eb"
            >
              <Icon as={FiUsers} w={12} h={12} color="#2563eb" mb={4} />
              <Heading as="h3" size="md" mb={3} color={headingColor}>
                Gestão de equipe
              </Heading>
              <Text color={textColor}>Distribua atendimentos e monitore o desempenho de cada Flow.</Text>
            </Card>
          </SimpleGrid>

          <Text textAlign="center" fontSize="xl" color={textColor} mt={12}>
            e muito mais...
          </Text>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Box as="section" py={{ base: 16, md: 24 }} bgGradient="linear(to-b, #f8fafc, white)">
        <Container maxW="container.xl">
          <VStack spacing={4} textAlign="center" mb={16}>
            <Heading as="h2" size={{ base: "xl", md: "2xl" }} color={headingColor}>
              Não acredite apenas nas nossas palavras
            </Heading>
            <Text fontSize="xl" color={textColor} maxW="2xl" mx="auto">
              Veja alguns de nossos clientes incríveis que estão tendo resultados
            </Text>
          </VStack>

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8} maxW="4xl" mx="auto">
            <Card
              bg={cardBg}
              rounded="xl"
              shadow="md"
              p={8}
              _hover={{ shadow: "xl" }}
              transition="all 0.3s ease"
              borderLeft="4px solid #2563eb"
            >
              <Box mb={6} color="#2563eb">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="currentColor">
                  <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                </svg>
              </Box>
              <Text fontSize="lg" color={textColor} mb={6}>
                "O VendFlow revolucionou nosso atendimento ao cliente. Reduzimos o tempo de resposta em mais de 90%."
              </Text>
              <Flex align="center">
                <Box mr={4}>
                  <Image
                    src="/src/assets/fotodepoimentodani.jpg"
                    alt="Danielle Reis"
                    boxSize="48px"
                    rounded="full"
                    objectFit="cover"
                  />
                </Box>
                <Box>
                  <Text fontWeight="bold" color={headingColor}>
                    @daniellecreis
                  </Text>
                  <Text color={textColor}>Expert Digital</Text>
                </Box>
              </Flex>
            </Card>
            <Card
              bg={cardBg}
              rounded="xl"
              shadow="md"
              p={8}
              _hover={{ shadow: "xl" }}
              transition="all 0.3s ease"
              borderLeft="4px solid #2563eb"
            >
              <Box mb={6} color="#2563eb">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="currentColor">
                  <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                </svg>
              </Box>
              <Text fontSize="lg" color={textColor} mb={6}>
                "A venda dos nossos produtos físicos aumentou muito com os fluxos criados pela minha equipe, nota 10!"
              </Text>
              <Flex align="center">
                <Box mr={4}>
                  <Image
                    src="/src/assets/fotodepoimentopdr.jpg"
                    alt="Pedro Santiago"
                    boxSize="48px"
                    rounded="full"
                    objectFit="cover"
                  />
                </Box>
                <Box>
                  <Text fontWeight="bold" color={headingColor}>
                    @pdrsantiago
                  </Text>
                  <Text color={textColor}>Expert Digital</Text>
                </Box>
              </Flex>
            </Card>
          </SimpleGrid>
        </Container>
      </Box>

      {/* Pricing Section */}
      <PricingSection />

      {/* Guarantee Section */}
      <Box as="section" py={{ base: 16, md: 24 }} bgGradient="linear(to-b, white, #f8fafc)">
        <Container maxW="4xl" px={4}>
          <Card
            bg={cardBg}
            p={10}
            rounded="2xl"
            shadow="lg"
            textAlign="center"
            borderTop="4px solid #ff9e2c"
          >
            <Heading as="h2" size={{ base: "xl", md: "2xl" }} mb={6} color={headingColor}>
              Seu dinheiro de volta
            </Heading>
            <Text fontSize="xl" color={textColor}>
              Caso não goste do serviço no prazo de 7 dias, seu dinheiro será devolvido. A renovação é automática e pode
              ser cancelada a qualquer momento, sem multas ou taxas adicionais.
            </Text>
            <Box mt={8}>
              <Icon as={FiCheck} w={16} h={16} color="#ff9e2c" />
            </Box>
          </Card>
        </Container>
      </Box>

      {/* FAQ Section */}
      <Box as="section" py={{ base: 16, md: 24 }}>
        <Container maxW="4xl" px={4}>
          <VStack spacing={4} textAlign="center" mb={16}>
            <Heading as="h2" size={{ base: "xl", md: "2xl" }} color={headingColor}>
              Perguntas frequentes
            </Heading>
            <Text fontSize="xl" color={textColor}>
              Tudo que você precisa saber sobre o VendFlow
            </Text>
          </VStack>

          <VStack spacing={6}>
            <Card
              bg={cardBg}
              p={6}
              rounded="xl"
              shadow="md"
              w="full"
              _hover={{ shadow: "lg" }}
              transition="all 0.3s ease"
            >
              <Heading as="h3" size="md" mb={3} color={headingColor}>
                O que é o VendFlow?
              </Heading>
              <Text color={textColor}>
                O VendFlow revoluciona a maneira de gerenciar atendimentos ao cliente, utilizando bots de criação
                própria do usuário, ele executa exatamente o que o usuário definir!
              </Text>
            </Card>

            <Card
              bg={cardBg}
              p={6}
              rounded="xl"
              shadow="md"
              w="full"
              _hover={{ shadow: "lg" }}
              transition="all 0.3s ease"
            >
              <Heading as="h3" size="md" mb={3} color={headingColor}>
                Para quem é indicado?
              </Heading>
              <Text color={textColor}>
                Para empresas que desejam otimizar seu atendimento ao cliente, reduzir tempo de resposta e melhorar a
                satisfação do cliente. Ideal para equipes que precisam gerenciar múltiplos canais de comunicação de
                forma eficiente.
              </Text>
            </Card>

            <Card
              bg={cardBg}
              p={6}
              rounded="xl"
              shadow="md"
              w="full"
              _hover={{ shadow: "lg" }}
              transition="all 0.3s ease"
            >
              <Heading as="h3" size="md" mb={3} color={headingColor}>
                Como funciona a política de reembolso?
              </Heading>
              <Text color={textColor}>
                Caso não esteja satisfeito ou não veja os resultados esperados, você pode solicitar um reembolso
                completo dentro de 7 dias após a compra. Esse processo é rápido e sem burocracias, garantindo a sua
                total satisfação com o serviço.
              </Text>
            </Card>
          </VStack>
        </Container>
      </Box>

      {/* Contact Section */}
      <Box as="section" id="contato" py={{ base: 16, md: 24 }} bgGradient="linear(to-b, #f8fafc, #e6f0ff)">
        <Container maxW="4xl" px={4} textAlign="center">
          <Heading as="h2" size={{ base: "xl", md: "2xl" }} mb={4} color={headingColor}>
            Ainda tem dúvidas?
          </Heading>
          <Text fontSize="xl" color={textColor} mb={10}>
            Não consegue encontrar a resposta que procura? Fale com a gente!
          </Text>
          <Button
            bg="#2563eb"
            color="white"
            size="lg"
            rounded="full"
            px={8}
            py={7}
            fontSize="lg"
            shadow="md"
            _hover={{ transform: "scale(1.05)", shadow: "lg", bg: "#f08c1a" }}
            transition="all 0.3s ease"
            onClick={() => (window.location.href = "https://w.app/ylcnew")}
          >
            Entrar em contato
          </Button>
        </Container>
      </Box>

      {/* Footer */}
      <Box as="footer" bg="gray.900" color="white" py={16}>
        <Container maxW="container.xl">
          <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={10} mb={10}>
            <Box>
              <Heading as="h3" size="md" mb={4}>
                Produto
              </Heading>
              <VStack spacing={2} align="start">
                <Link href="#funcionalidades" color="gray.300" _hover={{ color: "#ff9e2c" }}>
                  Funcionalidades
                </Link>
                <Link href="#preco" color="gray.300" _hover={{ color: "#ff9e2c" }}>
                  Preços
                </Link>
                <Link href="#faq" color="gray.300" _hover={{ color: "#ff9e2c" }}>
                  FAQ
                </Link>
              </VStack>
            </Box>
            <Box>
              <Heading as="h3" size="md" mb={4}>
                Termos
              </Heading>
              <VStack spacing={2} align="start">
                <Link href="#privacy" color="gray.300" _hover={{ color: "#2563eb" }}>
                  Privacidade
                </Link>
                <Link href="#terms" color="gray.300" _hover={{ color: "#2563eb" }}>
                  Termos de Uso
                </Link>
              </VStack>
            </Box>
            <Box>
              <Heading as="h3" size="md" mb={4}>
                Suporte
              </Heading>
              <VStack spacing={2} align="start">
                <Link href="#contact" color="gray.300" _hover={{ color: "#ff9e2c" }}>
                  Contato
                </Link>
                <Link href="#help" color="gray.300" _hover={{ color: "#2563eb" }}>
                  Central de Ajuda
                </Link>
              </VStack>
            </Box>
          </SimpleGrid>
          <Divider borderColor="gray.800" mb={8} />
          <Text textAlign="center" color="gray.400">
            Copyright &copy; 2025 VendFlow. Todos os direitos reservados.
          </Text>
        </Container>
      </Box>
    </Box>
  )
}
