import { Box, Heading, Text, Input, Button, Avatar, VStack, HStack } from "@chakra-ui/react";
import { useState } from "react";

const ConfigPage = () => {
  const [name, setName] = useState(""); // Estado para armazenar o nome
  const userEmail = "email@email.com"; // Substituir pelo email do banco de dados depois

  return (
    <Box width="100%" pl={4}>
      {/* Foto de Perfil e Upload */}
      <VStack spacing={4} align="start">
        <Heading size="sm">Perfil</Heading>
        <HStack>
          <Avatar size="xl" name="Kauan Massuia" src="https://via.placeholder.com/150" />
          <Button size="sm" variant="outline">Upload Foto</Button>
        </HStack>
      </VStack>

      {/* Nome */}
      <Box mt={6}>
        <Text fontSize="sm" fontWeight="bold">Nome:</Text>
        <Input
          placeholder="Digite seu nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          mt={1}
        />
      </Box>

      {/* Email (Somente Leitura) */}
      <Box mt={4}>
        <Text fontSize="sm" fontWeight="bold">Email:</Text>
        <Input value={userEmail} isReadOnly mt={1} />
      </Box>
    </Box>
  );
};

export default ConfigPage;
