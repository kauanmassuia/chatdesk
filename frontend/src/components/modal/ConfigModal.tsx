import { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Box,
  useBreakpointValue
} from "@chakra-ui/react";
import SidebarSettings from "../configModal/SidebarSettings";
import ConfigPage from "../configModal/ConfigPage";
import UseAndPaymentButton from "../configModal/UseAndPaymentButton";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ConfiguracaoModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [activePage, setActivePage] = useState("config");

  // Para telas pequenas usa 95% e para telas md para cima usa 60%
  const modalWidth = useBreakpointValue({ base: "95%", md: "60%" });
  // Altura fixa de 80% da viewport
  const modalHeight = "80%";

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered motionPreset="none">
      <ModalOverlay />
      <ModalContent
        maxW={modalWidth}
        height={modalHeight}
        borderRadius="lg"
        p={4}
      >
        <ModalCloseButton />
        <ModalBody
          p={0}
          display="flex"
          flexDirection={{ base: "column", md: "row" }}
          // Subtrai um espaço para footer se necessário
          height="calc(100% - 60px)"
        >
          {/* Sidebar */}
          <Box
            width={{ base: "100%", md: "250px" }}
            bg="gray.100"
            borderRight={{ md: "1px solid #e2e8f0" }}
            borderBottom={{ base: "1px solid #e2e8f0", md: "none" }}
            p={4}
          >
            <SidebarSettings setActivePage={setActivePage} />
          </Box>

          {/* Conteúdo com scroll */}
          <Box flex="1" p={4} overflowY="auto">
            {activePage === "config" && <ConfigPage />}
            {activePage === "payment" && <UseAndPaymentButton />}
          </Box>
        </ModalBody>

        <ModalFooter justifyContent="flex-end">
          <Button variant="ghost" onClick={onClose}>
            Fechar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ConfiguracaoModal;
