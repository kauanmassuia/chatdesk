import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { getFlow, updateFlowUrl } from '../services/flowService';
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
  AccordionPanel,
} from '@chakra-ui/react';
import Header from '../components/Header';
import FaqVideoModal from '../components/modal/FaqVideoModal'; // Ajuste o caminho conforme necessário

const Published: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const toast = useToast();
  const flowParam = searchParams.get('flow_id') || '';
  const uid = flowParam.split('/')[0];
  const [flow, setFlow] = useState<any>(null);
  const [customUrl, setCustomUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.700', 'gray.200');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  useEffect(() => {
    const fetchFlow = async () => {
      try {
        const data = await getFlow(uid);
        setFlow(data);
        setCustomUrl(data.custom_url);
      } catch (error) {
        console.error('Error fetching flow:', error);
      }
    };
    fetchFlow();
  }, [uid]);

  const handleSave = async () => {
    if (/\s/.test(customUrl)) {
      toast({
        title: 'Espaço detectado',
        description: 'A URL não pode conter espaços.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    setIsLoading(true);
    try {
      await updateFlowUrl(uid, customUrl);
      toast({
        title: 'Atualização bem-sucedida',
        description: 'Sua URL personalizada foi atualizada com sucesso.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      setTimeout(() => {
        navigate(`/editor?flow_id=${uid}`);
      }, 100);
    } catch (error) {
      console.error('Error updating custom_url:', error);
      toast({
        title: 'Erro na atualização',
        description: 'Não foi possível atualizar a URL personalizada.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Função para abrir o modal em vez de expandir o accordion
  const handleFaqClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  return (
    <Flex direction="column" minH="100vh" bg={bgColor}>
      <Header flowId={uid} />
      <Container maxW="container.md" pt={10} pb={8}>
        <VStack spacing={8} align="stretch">
          <Heading as="h1" size="xl" textAlign="left" color={textColor} mb={4}>
            Seu link VendFlow
          </Heading>
          
          <Box 
            p={4} 
            borderRadius="md" 
            boxShadow="sm"
            borderWidth="1px"
            borderColor={borderColor}
          >
            <HStack spacing={4} align="flex-start">
              <InputGroup size="md" maxW="450px">
                <InputLeftAddon children="https://vendflow.com.br/chat/" />
                <Input
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  placeholder="sua-url-personalizada"
                />
              </InputGroup>
              
              <Button 
                colorScheme="blue" 
                onClick={handleSave}
                isLoading={isLoading}
                size="md"
              >
                Salvar
              </Button>
              
              <Button
                variant="outline"
                onClick={() => {
                  navigator.clipboard.writeText(`https://vendflow.com.br/chat/${customUrl}`);
                  toast({
                    title: 'Link copiado',
                    description: 'O link foi copiado para a área de transferência.',
                    status: 'success',
                    duration: 2000,
                    isClosable: true,
                  });
                }}
              >
                Copiar
              </Button>
            </HStack>
          </Box>
          
          <Box mt={4}>
            <Heading as="h2" size="lg" mb={4}>
              Perguntas Frequentes
            </Heading>
            
            <Accordion allowToggle>
              <AccordionItem onClick={handleFaqClick} cursor="pointer">
                <h2>
                  <AccordionButton>
                    <Box flex="1" textAlign="left" fontWeight="medium">
                      Como usar o VendFlow? (Vídeo Tutorial)
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
              </AccordionItem>

              <AccordionItem onClick={handleFaqClick} cursor="pointer">
                <h2>
                  <AccordionButton>
                    <Box flex="1" textAlign="left" fontWeight="medium">
                      Como personalizar minha URL?
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
              </AccordionItem>

              <AccordionItem onClick={handleFaqClick} cursor="pointer">
                <h2>
                  <AccordionButton>
                    <Box flex="1" textAlign="left" fontWeight="medium">
                      Como compartilhar meu VendFlow?
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
              </AccordionItem>
            </Accordion>
          </Box>

          <FaqVideoModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </VStack>
      </Container>
    </Flex>
  );
};

export default Published;
