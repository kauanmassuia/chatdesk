// src/components/CreateFlowModal.tsx
import React, { useState } from 'react';
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  FormControl,
  FormLabel,
  Box,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { BsFileEarmarkPlus } from 'react-icons/bs';

interface CreateFlowModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (title: string) => void;
}

const CreateFlowModal: React.FC<CreateFlowModalProps> = ({ isOpen, onClose, onCreate }) => {
  const [title, setTitle] = useState('');

  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.700', 'gray.300');
  const iconColor = useColorModeValue('#ff9800', '#ff9800');

  const handleSubmit = () => {
    if (title.trim() !== '') {
      onCreate(title);
      setTitle(''); // reset for next time
      onClose();    // close modal after creation
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent bg={bgColor} boxShadow="lg" rounded="md" maxW="400px">
        <ModalHeader color={textColor} fontSize="lg" fontWeight="semibold">
          Criar um Flow
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <Box display="flex" alignItems="center" mb={4}>
            <Box color={iconColor} mr={3}>
              <BsFileEarmarkPlus size={24} />
            </Box>
            <Text color={textColor}>
              Dê um nome para o seu novo flow.
            </Text>
          </Box>
          <FormControl>
            <FormLabel color={textColor} fontSize="sm">Título do Flow</FormLabel>
            <Input
              placeholder="Digite o título do flow"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleSubmit(); } }}
              bg={useColorModeValue('gray.50', 'gray.700')}
              border="1px solid"
              borderColor={useColorModeValue('gray.200', 'gray.600')}
              _focus={{
                borderColor: '#ff9800',
                boxShadow: '0 0 0 1px #ff9800',
              }}
            />
          </FormControl>
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
            onClick={handleSubmit}
            bg="#ff9800"
            color="white"
            _hover={{ bg: '#f57c00' }}
            transition="all 0.3s ease"
          >
            Criar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateFlowModal;
