import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Box,
  Heading,
  Text,
  Spinner,
  Flex,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Grid,
  GridItem,
  FormControl,
  FormLabel,
  Input,
  Button,
  VStack,
  HStack,
  useToast,
  Image,
  Card,
  CardBody,
  Switch,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  ButtonGroup,
  RadioGroup,
  Radio,
  Stack,
  Collapse,
  useDisclosure,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
  Select,
  InputGroup,
} from '@chakra-ui/react';
import { FiImage, FiSave, FiPlayCircle, FiUpload, FiLink, FiChevronDown, FiSearch } from 'react-icons/fi';
import { MdColorLens, MdImage, MdFormatColorFill, MdClose } from 'react-icons/md';
import { getFlow, updateFlow, updateFlowTitle } from '../services/flowService';
import Header from '../components/Header';
import TestChatReader from './TestChatReader';
import axios from 'axios';
import { Helmet } from 'react-helmet';
import logoImage from '../assets/logovendflow.png';

const Theme: React.FC = () => {
  const [searchParams] = useSearchParams();
  const flowParam = searchParams.get('flow_id') || '';
  const uid = flowParam.split('/')[0];

  const [flow, setFlow] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [chatTitle, setChatTitle] = useState<string>('Chat Assistant');
  const [botImage, setBotImage] = useState<string>('');
  const [fontSize, setFontSize] = useState<string>('1rem');
  const [fontFamily, setFontFamily] = useState<string>('Inter, sans-serif');
  const [textColor, setTextColor] = useState<string>('#1A202C');
  const [headingFontSize, setHeadingFontSize] = useState<string>('1.2rem');
  const [backgroundColor, setBackgroundColor] = useState<string>('#f9fafb');
  const [backgroundType, setBackgroundType] = useState<string>('color');
  const [backgroundImage, setBackgroundImage] = useState<string>('');
  const [showVendFlowBrand, setShowVendFlowBrand] = useState<boolean>(true);
  const [isPreviewVisible, setIsPreviewVisible] = useState<boolean>(true);
  const [themeSettings, setThemeSettings] = useState<any>({});
  const [activeSection, setActiveSection] = useState<string>('Global');
  const { isOpen: isImageModalOpen, onOpen: onImageModalOpen, onClose: onImageModalClose } = useDisclosure();
  const { isOpen: isProfileImageModalOpen, onOpen: onProfileImageModalOpen, onClose: onProfileImageModalClose } = useDisclosure();
  const [imageUploadMethod, setImageUploadMethod] = useState<string>('link');
  const [profileImageUploadMethod, setProfileImageUploadMethod] = useState<string>('link');
  const imageFileRef = useRef<HTMLInputElement>(null);
  const profileImageFileRef = useRef<HTMLInputElement>(null);
  const [colorPickerOption, setColorPickerOption] = useState<string>('standard');
  const [tempBotImage, setTempBotImage] = useState<string>('');

  const toast = useToast();

  // Predefined background colors
  const predefinedColors = [
    '#f9fafb', // Default light gray
    '#FFFFFF', // White
    '#F5F5F5', // Light gray
    '#FFF8E1', // Light yellow
    '#E3F2FD', // Light blue
    '#E8F5E9', // Light green
    '#F3E5F5', // Light purple
    '#FFEBEE', // Light red
  ];

  // Font group labels in Brazilian Portuguese
  const fontOptions = [
    { label: 'Sans Serif - Moderno', options: [
      { value: "Inter, sans-serif", label: "Inter" },
      { value: "'Roboto', sans-serif", label: "Roboto" },
      { value: "'Open Sans', sans-serif", label: "Open Sans" },
      { value: "'Poppins', sans-serif", label: "Poppins" },
      { value: "'Montserrat', sans-serif", label: "Montserrat" },
      { value: "'Nunito', sans-serif", label: "Nunito" },
      { value: "'Lato', sans-serif", label: "Lato" }
    ]},
    { label: 'Sans Serif - Estilizado', options: [
      { value: "'Raleway', sans-serif", label: "Raleway" },
      { value: "'Work Sans', sans-serif", label: "Work Sans" },
      { value: "'Rubik', sans-serif", label: "Rubik" },
      { value: "'Source Sans Pro', sans-serif", label: "Source Sans Pro" },
      { value: "'Ubuntu', sans-serif", label: "Ubuntu" },
      { value: "'Quicksand', sans-serif", label: "Quicksand" },
      { value: "'Lexend', sans-serif", label: "Lexend" }
    ]},
    { label: 'Serif - Elegante', options: [
      { value: "'Playfair Display', serif", label: "Playfair Display" },
      { value: "'Merriweather', serif", label: "Merriweather" },
      { value: "'Spectral', serif", label: "Spectral" },
      { value: "'Libre Baskerville', serif", label: "Libre Baskerville" },
      { value: "'Crimson Text', serif", label: "Crimson Text" }
    ]},
    { label: 'Display - Criativo', options: [
      { value: "'Comfortaa', cursive", label: "Comfortaa" },
      { value: "'Josefin Sans', sans-serif", label: "Josefin Sans" },
      { value: "'Archivo', sans-serif", label: "Archivo" },
      { value: "'Space Grotesk', sans-serif", label: "Space Grotesk" },
      { value: "'DM Sans', sans-serif", label: "DM Sans" }
    ]},
    { label: 'Monospace', options: [
      { value: "'Courier New', monospace", label: "Courier New" },
      { value: "'Roboto Mono', monospace", label: "Roboto Mono" },
      { value: "'JetBrains Mono', monospace", label: "JetBrains Mono" },
      { value: "'Fira Code', monospace", label: "Fira Code" }
    ]}
  ];

  // Find the current font option
  const getCurrentFontOption = () => {
    for (const group of fontOptions) {
      const option = group.options.find(opt => opt.value === fontFamily);
      if (option) return option;
    }
    return null;
  };

  // Fetch flow data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const flowData = await getFlow(uid);
        setFlow(flowData);

        // Initialize theme settings from flow data
        if (flowData.bot_image) {
          setBotImage(flowData.bot_image);
        }

        // Initialize theme settings from metadata.theme if available
        if (flowData.metadata && flowData.metadata.theme) {
          const { theme } = flowData.metadata;
          // Use the chat title from theme settings if available, otherwise fallback to flow title
          if (theme.chatTitle) {
            setChatTitle(theme.chatTitle);
          } else if (flowData.title) {
            setChatTitle(flowData.title);
          }

          // Load font and color settings
          if (theme.fontSize) setFontSize(theme.fontSize);
          if (theme.fontFamily) setFontFamily(theme.fontFamily);
          if (theme.textColor) setTextColor(theme.textColor);
          if (theme.headingFontSize) setHeadingFontSize(theme.headingFontSize);
          if (theme.backgroundColor) setBackgroundColor(theme.backgroundColor);
          if (theme.backgroundType) setBackgroundType(theme.backgroundType);
          if (theme.backgroundImage) setBackgroundImage(theme.backgroundImage);
          if (theme.showVendFlowBrand !== undefined) setShowVendFlowBrand(theme.showVendFlowBrand);
          // Use bot profile image from theme if available, otherwise use the flow.bot_image
          if (theme.botProfileImg) setBotImage(theme.botProfileImg);
        } else if (flowData.title) {
          // If no theme settings, use flow title as initial chat title
          setChatTitle(flowData.title);
        }

        // Set theme settings for the preview
        setThemeSettings({
          chatTitle: flowData.metadata?.theme?.chatTitle || flowData.title || 'Chat Assistant',
          botProfileImg: flowData.metadata?.theme?.botProfileImg || flowData.bot_image || '',
          fontSize: flowData.metadata?.theme?.fontSize || '1rem',
          fontFamily: flowData.metadata?.theme?.fontFamily || 'Inter, sans-serif',
          textColor: flowData.metadata?.theme?.textColor || '#1A202C',
          headingFontSize: flowData.metadata?.theme?.headingFontSize || '1.2rem',
          backgroundColor: flowData.metadata?.theme?.backgroundColor || '#f9fafb',
          backgroundType: flowData.metadata?.theme?.backgroundType || 'color',
          backgroundImage: flowData.metadata?.theme?.backgroundImage || '',
          showVendFlowBrand: flowData.metadata?.theme?.showVendFlowBrand !== undefined ?
            flowData.metadata.theme.showVendFlowBrand : true,
        });
      } catch (err) {
        console.error('Error fetching flow data:', err);
        setError('Failed to load flow data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [uid]);

  // Update preview when theme settings change
  useEffect(() => {
    if (!flow) return;

    setThemeSettings({
      chatTitle,
      botProfileImg: botImage,
      fontSize,
      fontFamily,
      textColor,
      headingFontSize,
      backgroundColor: backgroundType === 'color' ? backgroundColor : 'transparent',
      backgroundType,
      backgroundImage,
      showVendFlowBrand,
    });
  }, [
    chatTitle,
    botImage,
    fontSize,
    fontFamily,
    textColor,
    headingFontSize,
    backgroundColor,
    backgroundType,
    backgroundImage,
    showVendFlowBrand,
    flow
  ]);

  const handleSaveTheme = async () => {
    try {
      // Create a copy of the flow to update
      const updatedFlow = { ...flow };

      // Don't update the flow title
      updatedFlow.bot_image = botImage;

      // Ensure metadata exists
      updatedFlow.metadata = updatedFlow.metadata || {};

      // Update theme settings in metadata
      updatedFlow.metadata.theme = {
        ...(updatedFlow.metadata.theme || {}),
        chatTitle,
        fontSize,
        fontFamily,
        textColor,
        headingFontSize,
        backgroundColor,
        backgroundType,
        backgroundImage,
        showVendFlowBrand,
        botProfileImg: botImage,
      };

      // Update the flow on the server
      // First update the flow title (not chat title) using the updateFlowTitle service
      await updateFlowTitle(uid, flow.title);

      // Update bot image
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1'}/flows/${uid}`,
        { flow: { bot_image: botImage } },
        {
          headers: {
            'access-token': localStorage.getItem("access-token"),
            client: localStorage.getItem("client"),
            uid: localStorage.getItem("uid")
          },
          withCredentials: true,
        }
      );

      // Then update the flow with the new content and metadata
      await updateFlow(
        uid,
        updatedFlow.content,
        false,
        updatedFlow.metadata
      );

      // Update local state with new theme settings
      setThemeSettings({
        chatTitle,
        botProfileImg: botImage,
        fontSize,
        fontFamily,
        textColor,
        headingFontSize,
        backgroundColor: backgroundType === 'color' ? backgroundColor : 'transparent',
        backgroundType,
        backgroundImage,
        showVendFlowBrand,
      });

      toast({
        title: "Tema atualizado",
        description: "Suas configurações de tema foram salvas com sucesso.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      console.error('Error saving theme:', err);
      toast({
        title: "Erro ao salvar tema",
        description: "Ocorreu um problema ao salvar suas configurações de tema.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a production environment, you would upload the file to a server
      // For demo purposes, we'll create a local URL
      const url = URL.createObjectURL(file);
      setBackgroundImage(url);
      onImageModalClose();
    }
  };

  const handleImageUrlSubmit = (url: string) => {
    setBackgroundImage(url);
    onImageModalClose();
  };

  const handleProfileImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a production environment, you would upload the file to a server
      // For demo purposes, we'll create a local URL
      const url = URL.createObjectURL(file);
      setTempBotImage(url);
      onProfileImageModalClose();
      setBotImage(url);
    }
  };

  const handleProfileImageUrlSubmit = (url: string) => {
    setTempBotImage(url);
    onProfileImageModalClose();
    setBotImage(url);
  };

  if (loading) {
    return (
      <Flex direction="column" h="100vh">
        <Helmet>
          <link href="https://fonts.googleapis.com/css2?family=Archivo&family=Comfortaa&family=Crimson+Text&family=DM+Sans&family=Fira+Code&family=Inter&family=JetBrains+Mono&family=Josefin+Sans&family=Lato&family=Lexend&family=Libre+Baskerville&family=Merriweather&family=Montserrat&family=Nunito&family=Open+Sans&family=Playfair+Display&family=Poppins&family=Quicksand&family=Raleway&family=Roboto&family=Roboto+Mono&family=Rubik&family=Source+Sans+Pro&family=Space+Grotesk&family=Spectral&family=Ubuntu&family=Work+Sans&display=swap" rel="stylesheet" />
        </Helmet>
        <Header flowId={uid} />
        <Box p={5} textAlign="center" mt="56px">
          <Spinner size="xl" />
          <Text mt={3}>Carregando configurações do tema...</Text>
        </Box>
      </Flex>
    );
  }

  if (error) {
    return (
      <Flex direction="column" h="100vh">
        <Helmet>
          <link href="https://fonts.googleapis.com/css2?family=Archivo&family=Comfortaa&family=Crimson+Text&family=DM+Sans&family=Fira+Code&family=Inter&family=JetBrains+Mono&family=Josefin+Sans&family=Lato&family=Lexend&family=Libre+Baskerville&family=Merriweather&family=Montserrat&family=Nunito&family=Open+Sans&family=Playfair+Display&family=Poppins&family=Quicksand&family=Raleway&family=Roboto&family=Roboto+Mono&family=Rubik&family=Source+Sans+Pro&family=Space+Grotesk&family=Spectral&family=Ubuntu&family=Work+Sans&display=swap" rel="stylesheet" />
        </Helmet>
        <Header flowId={uid} />
        <Box p={5} mt="56px">
          <Alert status="error" borderRadius="md">
            <AlertIcon />
            <AlertTitle mr={2}>Erro</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </Box>
      </Flex>
    );
  }

  return (
    <Flex direction="column" h="100vh">
      <Helmet>
        <link href="https://fonts.googleapis.com/css2?family=Archivo&family=Comfortaa&family=Crimson+Text&family=DM+Sans&family=Fira+Code&family=Inter&family=JetBrains+Mono&family=Josefin+Sans&family=Lato&family=Lexend&family=Libre+Baskerville&family=Merriweather&family=Montserrat&family=Nunito&family=Open+Sans&family=Playfair+Display&family=Poppins&family=Quicksand&family=Raleway&family=Roboto&family=Roboto+Mono&family=Rubik&family=Source+Sans+Pro&family=Space+Grotesk&family=Spectral&family=Ubuntu&family=Work+Sans&display=swap" rel="stylesheet" />
      </Helmet>
      <Header flowId={uid} />
      <Box p={5} mt="56px">
        <Heading size="md" mb={4}>Configurações de Tema</Heading>

        <Grid templateColumns={{ base: "1fr", md: isPreviewVisible ? "1fr 2fr" : "1fr" }} gap={6}>
          {/* Theme Settings Panel */}
          <GridItem maxW={{ md: "400px" }}>
            <Card variant="outline" shadow="sm">
              <CardBody>
                {/* Tab buttons */}
                <Flex mb={6} borderBottom="1px solid" borderColor="gray.200">
                  <Box
                    px={4}
                    py={2}
                    cursor="pointer"
                    borderBottom={activeSection === 'Global' ? '2px solid #ED8936' : 'none'}
                    color={activeSection === 'Global' ? 'orange.500' : 'gray.500'}
                    fontWeight={activeSection === 'Global' ? 'medium' : 'normal'}
                    onClick={() => setActiveSection('Global')}
                  >
                    Global
                  </Box>
                  <Box
                    px={4}
                    py={2}
                    cursor="pointer"
                    borderBottom={activeSection === 'Chat' ? '2px solid #ED8936' : 'none'}
                    color={activeSection === 'Chat' ? 'orange.500' : 'gray.500'}
                    fontWeight={activeSection === 'Chat' ? 'medium' : 'normal'}
                    onClick={() => setActiveSection('Chat')}
                  >
                    Chat
                  </Box>
                </Flex>

                {/* Global Tab */}
                {activeSection === 'Global' && (
                  <VStack spacing={6} align="stretch">
                    <FormControl display="flex" alignItems="center" justifyContent="space-between">
                      <FormLabel htmlFor="show-vendflow-brand" mb="0" fontWeight="medium">
                        Mostrar marca VendFlow
                      </FormLabel>
                      <Switch
                        id="show-vendflow-brand"
                        colorScheme="orange"
                        isChecked={showVendFlowBrand}
                        onChange={(e) => setShowVendFlowBrand(e.target.checked)}
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel fontWeight="medium">Fonte</FormLabel>
                      <Box
                        border="1px solid"
                        borderColor="gray.200"
                        borderRadius="md"
                      >
                        <select
                          value={fontFamily}
                          onChange={(e) => setFontFamily(e.target.value)}
                          style={{
                            width: '100%',
                            padding: '10px 12px',
                            border: 'none',
                            outline: 'none',
                            borderRadius: '4px',
                            appearance: 'none',
                            backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")',
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'right 12px center',
                            backgroundSize: '16px',
                            fontSize: '14px',
                          }}
                        >
                          {fontOptions.map((group) => (
                            <optgroup key={group.label} label={group.label}>
                              {group.options.map((option) => (
                                <option key={option.value} value={option.value} style={{ fontFamily: option.value }}>
                                  {option.label}
                                </option>
                              ))}
                            </optgroup>
                          ))}
                        </select>
                      </Box>
                      <Text fontSize="xs" color="gray.500" mt={1}>
                        Selecione entre as fontes do Google
                      </Text>
                    </FormControl>

                    <FormControl>
                      <FormLabel fontWeight="medium">Plano de fundo</FormLabel>
                      <ButtonGroup isAttached mb={4} width="100%">
                        <Button
                          flex="1"
                          colorScheme={backgroundType === 'color' ? 'orange' : 'gray'}
                          variant={backgroundType === 'color' ? 'solid' : 'outline'}
                          leftIcon={<MdColorLens />}
                          onClick={() => setBackgroundType('color')}
                        >
                          Cor
                        </Button>
                        <Button
                          flex="1"
                          colorScheme={backgroundType === 'image' ? 'orange' : 'gray'}
                          variant={backgroundType === 'image' ? 'solid' : 'outline'}
                          leftIcon={<MdImage />}
                          onClick={() => setBackgroundType('image')}
                        >
                          Imagem
                        </Button>
                        <Button
                          flex="1"
                          colorScheme={backgroundType === 'none' ? 'orange' : 'gray'}
                          variant={backgroundType === 'none' ? 'solid' : 'outline'}
                          leftIcon={<MdClose />}
                          onClick={() => setBackgroundType('none')}
                        >
                          Nenhum
                        </Button>
                      </ButtonGroup>

                      <Collapse in={backgroundType === 'color'}>
                        <VStack spacing={4} align="stretch">
                          <Text fontWeight="medium" fontSize="sm">Cor de fundo</Text>

                          <Grid templateColumns="repeat(4, 1fr)" gap={2}>
                            {predefinedColors.map((color, index) => (
                              <Box
                                key={index}
                                width="100%"
                                height="36px"
                                bg={color}
                                border="1px solid"
                                borderColor="gray.200"
                                borderRadius="md"
                                cursor="pointer"
                                onClick={() => setBackgroundColor(color)}
                                position="relative"
                                overflow="hidden"
                              >
                                {backgroundColor === color && (
                                  <Box
                                    position="absolute"
                                    top="0"
                                    right="0"
                                    bottom="0"
                                    left="0"
                                    bg="blackAlpha.100"
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                    color="orange.500"
                                  >
                                    <MdFormatColorFill />
                                  </Box>
                                )}
                              </Box>
                            ))}
                          </Grid>

                          <InputGroup>
                            <Input
                              value={backgroundColor}
                              onChange={(e) => setBackgroundColor(e.target.value)}
                              placeholder="#f9fafb"
                              borderRadius="md"
                            />
                          </InputGroup>

                          <Button
                            variant="outline"
                            size="sm"
                            alignSelf="flex-start"
                            rightIcon={<FiChevronDown />}
                            onClick={() => setColorPickerOption(colorPickerOption === 'advanced' ? 'standard' : 'advanced')}
                          >
                            Cores avançadas
                          </Button>

                          <Collapse in={colorPickerOption === 'advanced'}>
                            <Box
                              border="1px solid"
                              borderColor="gray.200"
                              borderRadius="md"
                              p={4}
                              mt={2}
                            >
                              <Input
                                type="color"
                                value={backgroundColor}
                                onChange={(e) => setBackgroundColor(e.target.value)}
                                height="100px"
                                p={0}
                                cursor="pointer"
                                width="100%"
                              />
                            </Box>
                          </Collapse>
                        </VStack>
                      </Collapse>

                      <Collapse in={backgroundType === 'image'}>
                        <VStack spacing={4} align="stretch">
                          <Button
                            leftIcon={<FiImage />}
                            onClick={onImageModalOpen}
                            colorScheme="gray"
                            variant="outline"
                          >
                            Selecionar imagem
                          </Button>

                          {backgroundImage && (
                            <Box
                              mt={2}
                              position="relative"
                              border="1px solid"
                              borderColor="gray.200"
                              borderRadius="md"
                              overflow="hidden"
                            >
                              <Image
                                src={backgroundImage}
                                alt="Background"
                                width="100%"
                                height="150px"
                                objectFit="cover"
                              />
                              <Button
                                position="absolute"
                                top={2}
                                right={2}
                                size="sm"
                                colorScheme="red"
                                onClick={() => setBackgroundImage('')}
                              >
                                <MdClose />
                              </Button>
                            </Box>
                          )}
                        </VStack>
                      </Collapse>
                    </FormControl>

                    <Button
                      leftIcon={<FiSave />}
                      colorScheme="orange"
                      onClick={handleSaveTheme}
                      mt={4}
                    >
                      Salvar Tema
                    </Button>
                  </VStack>
                )}

                {/* Chat Tab */}
                {activeSection === 'Chat' && (
                  <VStack spacing={6} align="stretch">
                    <FormControl>
                      <FormLabel fontWeight="medium">Título da Interface de Chat</FormLabel>
                      <Input
                        value={chatTitle}
                        onChange={(e) => setChatTitle(e.target.value)}
                        placeholder="Digite um título para sua interface de chat"
                      />
                      <Text fontSize="xs" color="gray.500" mt={1}>
                        Isto será exibido no topo da interface de chat.
                      </Text>
                    </FormControl>

                    <FormControl>
                      <FormLabel fontWeight="medium">Imagem de Perfil do Bot</FormLabel>
                      <VStack align="start" spacing={3}>
                        <Button
                          leftIcon={<FiImage />}
                          onClick={onProfileImageModalOpen}
                          colorScheme="gray"
                          variant="outline"
                          width="100%"
                        >
                          Selecionar imagem de perfil
                        </Button>

                        {botImage && (
                          <Box
                            mt={2}
                            position="relative"
                            border="1px solid"
                            borderColor="gray.200"
                            borderRadius="md"
                            overflow="hidden"
                            p={2}
                          >
                            <Image
                              src={botImage}
                              alt="Bot profile"
                              boxSize="50px"
                              borderRadius="full"
                              objectFit="cover"
                              fallbackSrc="https://via.placeholder.com/50"
                            />
                            <Button
                              position="absolute"
                              top={2}
                              right={2}
                              size="sm"
                              colorScheme="red"
                              onClick={() => setBotImage('')}
                            >
                              <MdClose />
                            </Button>
                          </Box>
                        )}
                      </VStack>
                    </FormControl>

                    <Button
                      leftIcon={<FiSave />}
                      colorScheme="orange"
                      onClick={handleSaveTheme}
                      mt={4}
                    >
                      Salvar Tema
                    </Button>
                  </VStack>
                )}
              </CardBody>
            </Card>

            <HStack spacing={4} mt={4}>
              <Button
                leftIcon={<FiPlayCircle />}
                onClick={() => setIsPreviewVisible(!isPreviewVisible)}
                variant="outline"
              >
                {isPreviewVisible ? "Ocultar Prévia" : "Mostrar Prévia"}
              </Button>
            </HStack>
          </GridItem>

          {/* Chat Preview */}
          {isPreviewVisible && (
            <GridItem>
              <Card variant="outline" shadow="sm" overflow="hidden" h="700px">
                <CardBody p={0} overflow="hidden" h="100%"
                  style={{
                    backgroundImage: backgroundType === 'image' && backgroundImage ?
                      `url(${backgroundImage})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  {flow && flow.content && (
                    <TestChatReader
                      flowData={flow.content}
                      themeSettings={themeSettings}
                    />
                  )}
                </CardBody>
              </Card>
            </GridItem>
          )}
        </Grid>
      </Box>

      {/* Image Upload Modal */}
      <Modal isOpen={isImageModalOpen} onClose={onImageModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Carregar Imagem de Fundo</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <RadioGroup onChange={setImageUploadMethod} value={imageUploadMethod}>
              <Stack direction="row" mb={4}>
                <Radio value="upload" colorScheme="orange">Enviar Imagem</Radio>
                <Radio value="link" colorScheme="orange">URL da Imagem</Radio>
              </Stack>
            </RadioGroup>

            {imageUploadMethod === 'upload' ? (
              <VStack spacing={4} align="stretch">
                <input
                  type="file"
                  accept="image/*"
                  ref={imageFileRef}
                  style={{ display: 'none' }}
                  onChange={handleFileUpload}
                />
                <Button
                  leftIcon={<FiUpload />}
                  onClick={() => imageFileRef.current?.click()}
                  colorScheme="blue"
                >
                  Selecionar Arquivo de Imagem
                </Button>
              </VStack>
            ) : (
              <VStack spacing={4} align="stretch">
                <FormControl>
                  <FormLabel>URL da Imagem</FormLabel>
                  <Input
                    placeholder="https://exemplo.com/imagem.jpg"
                    value={backgroundImage}
                    onChange={(e) => setBackgroundImage(e.target.value)}
                  />
                </FormControl>
                <Button
                  leftIcon={<FiLink />}
                  colorScheme="blue"
                  onClick={() => handleImageUrlSubmit(backgroundImage)}
                >
                  Usar Esta URL
                </Button>
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={onImageModalClose}>Cancelar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Profile Image Upload Modal */}
      <Modal isOpen={isProfileImageModalOpen} onClose={onProfileImageModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Carregar Imagem de Perfil</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <RadioGroup onChange={setProfileImageUploadMethod} value={profileImageUploadMethod}>
              <Stack direction="row" mb={4}>
                <Radio value="upload" colorScheme="orange">Enviar Imagem</Radio>
                <Radio value="link" colorScheme="orange">URL da Imagem</Radio>
              </Stack>
            </RadioGroup>

            {profileImageUploadMethod === 'upload' ? (
              <VStack spacing={4} align="stretch">
                <input
                  type="file"
                  accept="image/*"
                  ref={profileImageFileRef}
                  style={{ display: 'none' }}
                  onChange={handleProfileImageFileUpload}
                />
                <Button
                  leftIcon={<FiUpload />}
                  onClick={() => profileImageFileRef.current?.click()}
                  colorScheme="blue"
                >
                  Selecionar Imagem de Perfil
                </Button>
              </VStack>
            ) : (
              <VStack spacing={4} align="stretch">
                <FormControl>
                  <FormLabel>URL da Imagem</FormLabel>
                  <Input
                    placeholder="https://exemplo.com/perfil.jpg"
                    value={tempBotImage}
                    onChange={(e) => setTempBotImage(e.target.value)}
                  />
                </FormControl>
                <Button
                  leftIcon={<FiLink />}
                  colorScheme="blue"
                  onClick={() => handleProfileImageUrlSubmit(tempBotImage)}
                >
                  Usar Esta URL
                </Button>
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={onProfileImageModalClose}>Cancelar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default Theme;
