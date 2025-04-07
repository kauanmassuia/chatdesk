import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  Box,
} from '@chakra-ui/react';

interface FaqVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FaqVideoModal: React.FC<FaqVideoModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full">
      <ModalOverlay backdropFilter="blur(10px)" />
      <ModalContent
        bg="transparent"
        boxShadow="none"
        display="flex"
        alignItems="center"
        justifyContent="center"
        width="100%"
        height="100%"
      >
        <ModalCloseButton color="white" zIndex="1" />
        <ModalBody
          p={0}
          width="100%"
          height="100%"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Box
            width="80%"
            height="80%"
            borderRadius="lg"
            overflow="hidden"
          >
            <iframe
              src="https://www.youtube.com/embed/seu-video-id"
              title="FAQ Video"
              width="100%"
              height="100%"
              style={{ border: 'none', borderRadius: '0.5rem' }}
              allowFullScreen
            />
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default FaqVideoModal;
