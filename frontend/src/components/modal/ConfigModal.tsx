import { useState } from "react";
import { Modal, ModalOverlay, ModalContent, ModalCloseButton, ModalBody, ModalFooter, Button, Flex, Box } from "@chakra-ui/react";
import SidebarSettings from "../configModal/SidebarSettings";
import ConfigPage from "../configModal/ConfigPage";
import UseAndPaymentButton from "../configModal/UseAndPaymentButton";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ConfiguracaoModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [activePage, setActivePage] = useState("config"); // Estado para armazenar a página ativa

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="100%" isCentered motionPreset="none">
      <ModalOverlay />
      <ModalContent maxW="80%" borderRadius="md" height="80%" position="fixed">
        <ModalCloseButton />
        <ModalBody p={1} display="flex" height="calc(100% - 60px)">
          {/* Sidebar fixa, sem scroll */}
          <Box width="250px" bg="gray.100" p={4} borderRight="1px solid #e2e8f0">
            <SidebarSettings setActivePage={setActivePage} />
          </Box>

          {/* Conteúdo com scroll */}
          <Box flex="1" p={4} overflowY="auto">
            {activePage === "config" && <ConfigPage />}
            {activePage === "payment" && <UseAndPaymentButton />}
          </Box>
        </ModalBody>
        <ModalFooter justifyContent="flex-end">
          <Button variant="ghost" onClick={onClose}>Fechar</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ConfiguracaoModal;
