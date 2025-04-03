import {
  Box,
  Heading,
  Text,
  Input,
  Button,
  Avatar,
  VStack,
  HStack
} from "@chakra-ui/react";
import { useState } from "react";

const ConfigPage = () => {
  const [name, setName] = useState("");
  const userEmail = "email@email.com";

  return (
    <Box width="100%" px={{ base: 4, md: 6 }} py={{ base: 6, md: 8 }}>
      <VStack spacing={8} align="start">
        {/* Perfil */}
        <Box width="100%">
          <Heading size="md" mb={4}>
            Perfil
          </Heading>
          <HStack spacing={4} flexWrap="wrap">
            <Avatar size="xl" name="Kauan Massuia" src="https://via.placeholder.com/150" />
            <Button size="sm" variant="outline">
              Upload Foto
            </Button>
          </HStack>
        </Box>

        {/* Nome */}
        <Box width="100%">
          <Text fontSize="sm" fontWeight="bold" mb={1}>
            Nome:
          </Text>
          <Input
            placeholder="Digite seu nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Box>

        {/* Email */}
        <Box width="100%">
          <Text fontSize="sm" fontWeight="bold" mb={1}>
            Email:
          </Text>
          <Input value={userEmail} isReadOnly />
        </Box>
      </VStack>
    </Box>
  );
};

export default ConfigPage;
