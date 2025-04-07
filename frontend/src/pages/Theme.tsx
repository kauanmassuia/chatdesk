import React, { useState, useEffect } from 'react';
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
  useColorModeValue,
  Grid,
  GridItem,
  FormControl,
  FormLabel,
  Input,
  Button,
  VStack,
  HStack,
  Divider,
  useToast,
  Image,
  Card,
  CardBody,
  Switch,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Select,
  InputGroup,
} from '@chakra-ui/react';
import { FiEdit, FiImage, FiSave, FiPlayCircle } from 'react-icons/fi';
import { getFlow, updateFlow, updateFlowTitle } from '../services/flowService';
import Header from '../components/Header';
import TestChatReader from './TestChatReader';
import axios from 'axios';

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
  const [textColor, setTextColor] = useState<string>('#1A202C'); // Chakra's gray.800
  const [headingFontSize, setHeadingFontSize] = useState<string>('1.2rem');
  const [backgroundColor, setBackgroundColor] = useState<string>('#f9fafb');
  const [isPreviewVisible, setIsPreviewVisible] = useState<boolean>(true);
  const [themeSettings, setThemeSettings] = useState<any>({});

  const toast = useToast();

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
        } else if (flowData.title) {
          // If no theme settings, use flow title as initial chat title
          setChatTitle(flowData.title);
        }

        // Set theme settings for the preview
        setThemeSettings({
          chatTitle: flowData.metadata?.theme?.chatTitle || flowData.title || 'Chat Assistant',
          botProfileImg: flowData.bot_image || '',
          fontSize: flowData.metadata?.theme?.fontSize || '1rem',
          fontFamily: flowData.metadata?.theme?.fontFamily || 'Inter, sans-serif',
          textColor: flowData.metadata?.theme?.textColor || '#1A202C',
          headingFontSize: flowData.metadata?.theme?.headingFontSize || '1.2rem',
          backgroundColor: flowData.metadata?.theme?.backgroundColor || '#f9fafb',
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
      backgroundColor,
    });
  }, [chatTitle, botImage, fontSize, fontFamily, textColor, headingFontSize, backgroundColor, flow]);

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
        chatTitle, // Store chat title in theme settings
        fontSize,
        fontFamily,
        textColor,
        headingFontSize,
        backgroundColor,
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
        backgroundColor,
      });

      toast({
        title: "Theme updated",
        description: "Your theme settings have been saved successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      console.error('Error saving theme:', err);
      toast({
        title: "Error saving theme",
        description: "There was a problem saving your theme settings.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  if (loading) {
    return (
      <Flex direction="column" h="100vh">
        <Header flowId={uid} />
        <Box p={5} textAlign="center" mt="56px">
          <Spinner size="xl" />
          <Text mt={3}>Loading theme settings...</Text>
        </Box>
      </Flex>
    );
  }

  if (error) {
    return (
      <Flex direction="column" h="100vh">
        <Header flowId={uid} />
        <Box p={5} mt="56px">
          <Alert status="error" borderRadius="md">
            <AlertIcon />
            <AlertTitle mr={2}>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </Box>
      </Flex>
    );
  }

  return (
    <Flex direction="column" h="100vh">
      <Header flowId={uid} />
      <Box p={5} mt="56px">
        <Heading size="md" mb={4}>Theme Settings</Heading>

        <Grid templateColumns={{ base: "1fr", md: isPreviewVisible ? "1fr 1fr" : "1fr" }} gap={6}>
          {/* Theme Settings Panel */}
          <GridItem>
            <Card variant="outline" shadow="sm">
              <CardBody>
                <Tabs colorScheme="orange" size="md">
                  <TabList>
                    <Tab>General</Tab>
                    <Tab>Colors</Tab>
                    <Tab>Typography</Tab>
                  </TabList>

                  <TabPanels>
                    {/* General Tab */}
                    <TabPanel>
                      <VStack spacing={6} align="stretch">
                        <FormControl>
                          <FormLabel fontWeight="medium">Chat Interface Title</FormLabel>
                          <Input
                            value={chatTitle}
                            onChange={(e) => setChatTitle(e.target.value)}
                            placeholder="Enter a title for your chat interface"
                          />
                          <Text fontSize="xs" color="gray.500" mt={1}>
                            This is displayed at the top of the chat interface.
                          </Text>
                        </FormControl>

                        <FormControl>
                          <FormLabel fontWeight="medium">Bot Profile Image</FormLabel>
                          <VStack align="start" spacing={3}>
                            <Input
                              value={botImage}
                              onChange={(e) => setBotImage(e.target.value)}
                              placeholder="Enter image URL"
                            />
                            {botImage && (
                              <Box border="1px solid" borderColor="gray.200" borderRadius="md" p={2}>
                                <Image
                                  src={botImage}
                                  alt="Bot profile"
                                  boxSize="50px"
                                  borderRadius="full"
                                  fallbackSrc="https://via.placeholder.com/50"
                                />
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
                          Save Theme
                        </Button>
                      </VStack>
                    </TabPanel>

                    {/* Colors Tab - To be implemented */}
                    <TabPanel>
                      <VStack spacing={6} align="stretch">
                        <FormControl>
                          <FormLabel fontWeight="medium">Background Color</FormLabel>
                          <InputGroup>
                            <Input
                              type="color"
                              value={backgroundColor}
                              onChange={(e) => setBackgroundColor(e.target.value)}
                              width="80px"
                              padding="0"
                              height="40px"
                            />
                            <Input
                              value={backgroundColor}
                              onChange={(e) => setBackgroundColor(e.target.value)}
                              ml={2}
                              placeholder="#f9fafb"
                            />
                          </InputGroup>
                        </FormControl>

                        <FormControl>
                          <FormLabel fontWeight="medium">Font Size</FormLabel>
                          <Select
                            value={fontSize}
                            onChange={(e) => setFontSize(e.target.value)}
                          >
                            <option value="0.875rem">Small (0.875rem)</option>
                            <option value="1rem">Medium (1rem)</option>
                            <option value="1.125rem">Large (1.125rem)</option>
                            <option value="1.25rem">Extra Large (1.25rem)</option>
                          </Select>
                        </FormControl>

                        <Button
                          leftIcon={<FiSave />}
                          colorScheme="orange"
                          onClick={handleSaveTheme}
                          mt={4}
                        >
                          Save Theme
                        </Button>
                      </VStack>
                    </TabPanel>

                    {/* Typography Tab - To be implemented */}
                    <TabPanel>
                      <VStack spacing={6} align="stretch">
                        <FormControl>
                          <FormLabel fontWeight="medium">Font Family</FormLabel>
                          <Select
                            value={fontFamily}
                            onChange={(e) => setFontFamily(e.target.value)}
                          >
                            <option value="Inter, sans-serif">Inter (Sans-serif)</option>
                            <option value="Roboto, sans-serif">Roboto (Sans-serif)</option>
                            <option value="'Open Sans', sans-serif">Open Sans (Sans-serif)</option>
                            <option value="'Playfair Display', serif">Playfair Display (Serif)</option>
                            <option value="'Courier New', monospace">Courier New (Monospace)</option>
                          </Select>
                        </FormControl>

                        <FormControl>
                          <FormLabel fontWeight="medium">Body Font Size</FormLabel>
                          <Select
                            value={fontSize}
                            onChange={(e) => setFontSize(e.target.value)}
                          >
                            <option value="0.875rem">Small (0.875rem)</option>
                            <option value="1rem">Medium (1rem)</option>
                            <option value="1.125rem">Large (1.125rem)</option>
                            <option value="1.25rem">Extra Large (1.25rem)</option>
                          </Select>
                        </FormControl>

                        <FormControl>
                          <FormLabel fontWeight="medium">Heading Font Size</FormLabel>
                          <Select
                            value={headingFontSize}
                            onChange={(e) => setHeadingFontSize(e.target.value)}
                          >
                            <option value="1rem">Small (1rem)</option>
                            <option value="1.2rem">Medium (1.2rem)</option>
                            <option value="1.5rem">Large (1.5rem)</option>
                            <option value="1.8rem">Extra Large (1.8rem)</option>
                          </Select>
                        </FormControl>

                        <FormControl>
                          <FormLabel fontWeight="medium">Text Color</FormLabel>
                          <InputGroup>
                            <Input
                              type="color"
                              value={textColor}
                              onChange={(e) => setTextColor(e.target.value)}
                              width="80px"
                              padding="0"
                              height="40px"
                            />
                            <Input
                              value={textColor}
                              onChange={(e) => setTextColor(e.target.value)}
                              ml={2}
                              placeholder="#1A202C"
                            />
                          </InputGroup>
                        </FormControl>

                        <Button
                          leftIcon={<FiSave />}
                          colorScheme="orange"
                          onClick={handleSaveTheme}
                          mt={4}
                        >
                          Save Theme
                        </Button>
                      </VStack>
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              </CardBody>
            </Card>

            <HStack spacing={4} mt={4}>
              <Button
                leftIcon={<FiPlayCircle />}
                onClick={() => setIsPreviewVisible(!isPreviewVisible)}
                variant="outline"
              >
                {isPreviewVisible ? "Hide Preview" : "Show Preview"}
              </Button>
            </HStack>
          </GridItem>

          {/* Chat Preview */}
          {isPreviewVisible && (
            <GridItem>
              <Card variant="outline" shadow="sm" overflow="hidden" h="700px">
                <CardBody p={0}>
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
    </Flex>
  );
};

export default Theme;
