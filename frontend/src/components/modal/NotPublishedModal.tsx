import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Text,
  Box,
  ModalCloseButton,
  useColorModeValue,
} from '@chakra-ui/react';
import { FiAlertTriangle } from 'react-icons/fi';

interface NotPublishedModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPublish: () => void;
}

const NotPublishedModal: React.FC<NotPublishedModalProps> = ({ isOpen, onClose, onPublish }) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.700', 'gray.300');
  const iconColor = useColorModeValue('#ff9800', '#ff9800');

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent bg={bgColor} boxShadow="lg" rounded="md" maxW="400px">
        <ModalHeader color={textColor} fontSize="lg" fontWeight="semibold">
          Flow não publicado
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <Box display="flex" alignItems="center" mb={4}>
            <Box color={iconColor} mr={3}>
              <FiAlertTriangle size={24} />
            </Box>
            <Text color={textColor}>
              Para compartilhar este flow, é necessário publicá-lo primeiro.
            </Text>
          </Box>
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
            Fechar
          </Button>
          <Button
            size="sm"
            colorScheme="orange"
            onClick={onPublish}
            bg="#ff9800"
            color="white"
            _hover={{ bg: '#f57c00' }}
            transition="all 0.3s ease"
          >
            Publicar agora
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default NotPublishedModal;
