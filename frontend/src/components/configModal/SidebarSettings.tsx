import {
  Box,
  Flex,
  Text,
  VStack,
  HStack,
  useColorModeValue,
  Icon
} from "@chakra-ui/react";
import { FaUser, FaCreditCard } from "react-icons/fa";

interface SidebarProps {
  setActivePage: (page: string) => void;
  activePage: string;
}

const SidebarSettings: React.FC<SidebarProps> = ({ setActivePage, activePage }) => {
  // Define color scheme
  const primaryColor = useColorModeValue("#2575fc", "#4299e1");
  const secondaryBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "white");
  const mutedTextColor = useColorModeValue("gray.600", "gray.400");
  const hoverBg = useColorModeValue("gray.50", "gray.700");

  // Nav items config
  const navItems = [
    {
      id: "config",
      label: "Perfil",
      icon: FaUser
    },
    {
      id: "payment",
      label: "Pagamento e Uso",
      icon: FaCreditCard
    }
  ];

  return (
    <VStack
      width="100%"
      spacing={6}
      align="start"
    >
      <Text
        fontSize="lg"
        fontWeight="600"
        color={textColor}
        letterSpacing="tight"
      >
        Configurações
      </Text>


      <VStack width="100%" spacing={1} align="start">
        {navItems.map((item) => (
          <Box
            key={item.id}
            as="button"
            width="100%"
            onClick={() => setActivePage(item.id)}
            py={3}
            px={4}
            borderRadius="md"
            position="relative"
            transition="all 0.2s"
            bg={activePage === item.id ? hoverBg : "transparent"}
            _hover={{ bg: hoverBg }}
            role="group"
          >
            <HStack spacing={3} width="100%">
              <Box
                width="4px"
                height={activePage === item.id ? "60%" : "0%"}
                bg={primaryColor}
                position="absolute"
                left={0}
                top="20%"
                borderRadius="full"
                transition="all 0.2s"
              />

              <Icon
                as={item.icon}
                fontSize="18px"
                color={activePage === item.id ? primaryColor : mutedTextColor}
                transition="all 0.2s"
              />

              <Text
                color={activePage === item.id ? textColor : mutedTextColor}
                fontWeight={activePage === item.id ? "medium" : "normal"}
                fontSize="sm"
                transition="all 0.2s"
              >
                {item.label}
              </Text>

              {activePage === item.id && (
                <Box
                  width="8px"
                  height="8px"
                  borderRadius="full"
                  bg={primaryColor}
                  ml="auto"
                />
              )}
            </HStack>
          </Box>
        ))}
      </VStack>
    </VStack>
  );
};

export default SidebarSettings;
