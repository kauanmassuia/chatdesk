import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Textarea,
  ModalCloseButton,
  useToast,
  useColorModeValue,
  Box,
  Text,
} from '@chakra-ui/react';
import { useFlowStore } from '../../store/flowStore';
import { importFlowFromJson } from '../../utils/importFlowFromJson';
import { RiUploadCloudLine } from 'react-icons/ri';

interface ImportFlowModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ImportFlowModal: React.FC<ImportFlowModalProps> = ({ isOpen, onClose }) => {
  const [jsonText, setJsonText] = useState('');
  const toast = useToast();
  const { setNodes, setEdges } = useFlowStore();

  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.700', 'gray.300');
  const iconColor = useColorModeValue('#ff9800', '#ff9800');

  const handleImport = () => {
    try {
      const parsed = JSON.parse(jsonText);
      if (!parsed.nodes) {
        toast({
          title: 'JSON Inválido',
          description: 'O JSON deve ter uma propriedade "nodes".',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return;
      }
      // Convert the exported JSON to the internal format.
      const { nodes, edges } = importFlowFromJson(parsed);
      setNodes(nodes);
      setEdges(edges);
      toast({
        title: 'Importação Concluída',
        description: 'Flow importado com sucesso.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onClose();
    } catch (error) {
      toast({
        title: 'Erro ao Processar JSON',
        description:
          error instanceof Error ? error.message : 'Ocorreu um erro desconhecido',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent bg={bgColor} boxShadow="lg" rounded="md" maxW="500px">
        <ModalHeader color={textColor} fontSize="lg" fontWeight="semibold">
          Importar Flow
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <Box display="flex" alignItems="center" mb={4}>
            <Box color={iconColor} mr={3}>
              <RiUploadCloudLine size={24} />
            </Box>
            <Text color={textColor} mb={2}>
              Cole o JSON do seu flow abaixo para importá-lo.
            </Text>
          </Box>
          <Textarea
            placeholder="Cole seu JSON aqui..."
            value={jsonText}
            onChange={(e) => setJsonText(e.target.value)}
            rows={10}
            bg={useColorModeValue('gray.50', 'gray.700')}
            border="1px solid"
            borderColor={useColorModeValue('gray.200', 'gray.600')}
            _focus={{
              borderColor: '#ff9800',
              boxShadow: '0 0 0 1px #ff9800',
            }}
          />
        </ModalBody>
        <ModalFooter>
          <Button
            size="sm"
            variant="outline"
            mr={3}
            onClick={onClose}
            color="#6c757d"
            _hover={{ bg: '#f8f9fa', color: '#6c757d' }}
            transition="all 0.3s ease"
          >
            Cancelar
          </Button>
          <Button
            size="sm"
            colorScheme="orange"
            onClick={handleImport}
            bg="#ff9800"
            color="white"
            _hover={{ bg: '#f57c00' }}
            transition="all 0.3s ease"
          >
            Importar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ImportFlowModal;
