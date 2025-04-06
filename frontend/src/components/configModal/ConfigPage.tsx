import {
  Box,
  Heading,
  Text,
  Input,
  Button,
  Avatar,
  VStack,
  HStack,
  useColorModeValue,
  Flex,
  FormControl,
  FormLabel
} from "@chakra-ui/react";
import { useState } from "react";

const ConfigPage = () => {
  const [name, setName] = useState("");
  const userEmail = "email@email.com";

  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  return (
    <Box
      width="100%"
      height="100%"
      overflowY="auto"
    >
      <VStack spacing={{ base: 6, md: 8 }} align="stretch">
        {/* Profile Section */}
        <Box>
          <Heading size="md" mb={4} fontWeight="500">
            Perfil
          </Heading>
          <Flex
            direction={{ base: "column", sm: "row" }}
            align={{ base: "center", sm: "flex-start" }}
            gap={4}
          >
            <Avatar
              size={{ base: "lg", md: "xl" }}
              name="Kauan Massuia"
              src="https://via.placeholder.com/150"
              mb={{ base: 3, sm: 0 }}
            />
            <Button
              size="sm"
              variant="outline"
              borderColor={borderColor}
              alignSelf={{ base: "center", sm: "flex-start" }}
              _hover={{ bg: useColorModeValue("gray.50", "gray.700") }}
            >
              Upload Foto
            </Button>
          </Flex>
        </Box>

        {/* Name */}
        <FormControl>
          <FormLabel fontSize="sm" fontWeight="medium">
            Nome
          </FormLabel>
          <Input
            placeholder="Digite seu nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            borderColor={borderColor}
            _hover={{ borderColor: useColorModeValue("gray.300", "gray.600") }}
            maxW={{ base: "100%", md: "80%" }}
          />
        </FormControl>

        {/* Email */}
        <FormControl>
          <FormLabel fontSize="sm" fontWeight="medium">
            Email
          </FormLabel>
          <Input
            value={userEmail}
            isReadOnly
            borderColor={borderColor}
            bg={useColorModeValue("gray.50", "gray.700")}
            maxW={{ base: "100%", md: "80%" }}
          />
        </FormControl>
      </VStack>
    </Box>
  );
};

export default ConfigPage;
