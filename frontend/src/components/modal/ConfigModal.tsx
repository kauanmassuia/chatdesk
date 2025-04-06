import { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  Box,
  useColorModeValue,
  Flex,
  Heading
} from "@chakra-ui/react";
import SidebarSettings from "../configModal/SidebarSettings";
import ConfigPage from "../configModal/ConfigPage";
import UseAndPaymentButton from "../configModal/UseAndPaymentButton";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: string;
}

const ConfiguracaoModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, initialTab = "config" }) => {
  const [activePage, setActivePage] = useState(initialTab);

  // Update activePage whenever initialTab or isOpen changes
  useEffect(() => {
    if (initialTab) {
      setActivePage(initialTab);
    }
  }, [initialTab, isOpen]);

  // Colors for light/dark mode
  const bgColor = useColorModeValue("white", "gray.800");
  const sidebarBg = useColorModeValue("gray.50", "gray.900");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const primaryColor = useColorModeValue("#2575fc", "#4299e1");

  // Get the active page title
  const getPageTitle = () => {
    switch(activePage) {
      case "config":
        return "Perfil";
      case "payment":
        return "Pagamento e Uso";
      default:
        return "Configurações";
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isCentered
      motionPreset="scale"
      onEsc={onClose}
      onOverlayClick={onClose}
      preserveScrollBarGap
      size="6xl"
    >
      <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(5px)" />
      <ModalContent
        width={{ base: "95%", md: "90%", lg: "85%" }}
        maxW="1200px"
        height="80%"
        maxHeight="80%"
        borderRadius="xl"
        overflow="hidden"
        boxShadow="xl"
        bg={bgColor}
        position="relative"
        my="10%"
      >
        <ModalCloseButton
          top={4}
          right={4}
          zIndex="modal"
          borderRadius="full"
          size="sm"
          color={useColorModeValue("gray.600", "gray.400")}
          _hover={{ bg: useColorModeValue('gray.100', 'gray.700') }}
        />

        <ModalBody
          p={0}
          display="flex"
          flexDirection={{ base: "column", md: "row" }}
          height="100%"
        >
          {/* Sidebar */}
          <Box
            width={{ base: "100%", md: "250px" }}
            borderRight={{ md: `1px solid` }}
            borderBottom={{ base: `1px solid`, md: "none" }}
            borderColor={{ md: "gray.200" }}
            bg={sidebarBg}
            overflowY="auto"
            p={0}
            h={{ base: "auto", md: "100%" }}
          >
            <Box
              p={{ base: 4, md: 5 }}
              h="100%"
            >
              <SidebarSettings setActivePage={setActivePage} activePage={activePage} />
            </Box>
          </Box>

          {/* Content */}
          <Box
            flex="1"
            overflowY="auto"
            h="100%"
            position="relative"
          >
            <Box
              p={6}
              borderBottom="1px solid"
              borderColor={borderColor}
              position="sticky"
              top={0}
              bg={bgColor}
              zIndex={1}
            >
              <Heading size="md" color={primaryColor}>
                {getPageTitle()}
              </Heading>
            </Box>

            <Box p={6}>
              {activePage === "config" && <ConfigPage />}
              {activePage === "payment" && <UseAndPaymentButton />}
            </Box>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ConfiguracaoModal;
