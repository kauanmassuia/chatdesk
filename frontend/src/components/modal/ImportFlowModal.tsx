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
} from '@chakra-ui/react';
import { useFlowStore } from '../../store/flowStore';
import { importFlowFromJson } from '../../utils/importFlowFromJson';

interface ImportFlowModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ImportFlowModal: React.FC<ImportFlowModalProps> = ({ isOpen, onClose }) => {
  const [jsonText, setJsonText] = useState('');
  const toast = useToast();
  const { setNodes, setEdges } = useFlowStore();

  const handleImport = () => {
    try {
      const parsed = JSON.parse(jsonText);
      if (!parsed.nodes) {
        toast({
          title: 'Invalid JSON',
          description: 'The JSON must have a "nodes" property.',
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
        title: 'Import Successful',
        description: 'Flow has been imported successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onClose();
    } catch (error) {
      toast({
        title: 'Error Parsing JSON',
        description:
          error instanceof Error ? error.message : 'An unknown error occurred',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Import Flow JSON</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Textarea
            placeholder="Paste your exported JSON here..."
            value={jsonText}
            onChange={(e) => setJsonText(e.target.value)}
            rows={10}
          />
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme="blue" onClick={handleImport}>
            Import
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ImportFlowModal;
