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
} from '@chakra-ui/react';

interface CreateFlowModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (title: string) => void;
}

const CreateFlowModal: React.FC<CreateFlowModalProps> = ({ isOpen, onClose, onCreate }) => {
  const [title, setTitle] = useState('');

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
      <ModalContent>
        <ModalHeader>Create a Flow</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel>Flow Title</FormLabel>
            <Input
              placeholder="Enter flow title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleSubmit(); } }}
            />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
            Create
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateFlowModal;
