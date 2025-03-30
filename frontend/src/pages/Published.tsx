import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { getFlow, updateFlowUrl } from '../services/flowService';
import { Box, Input, Button, Heading, Text, useToast } from '@chakra-ui/react';

const Published: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const toast = useToast();
  const flowParam = searchParams.get('flow_id') || '';
  const uid = flowParam.split('/')[0];
  const [flow, setFlow] = useState<any>(null);
  const [customUrl, setCustomUrl] = useState('');

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
    // Check for spaces in customUrl
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
    }
  };

  return (
    <Box p={6}>
      <Heading mb={4}>Edit Custom URL</Heading>
      {flow ? (
        <>
          <Text mb={2}>Current Title: {flow.title}</Text>
          <Input
            mb={4}
            value={customUrl}
            onChange={(e) => setCustomUrl(e.target.value)}
            placeholder="Enter custom URL"
          />
          <Button colorScheme="blue" onClick={handleSave}>Save</Button>
        </>
      ) : (
        <Text>Loading flow details...</Text>
      )}
    </Box>
  );
};

export default Published;
