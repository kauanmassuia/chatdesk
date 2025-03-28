import { Box, Heading, Text } from "@chakra-ui/react";

const BotaoInputsDocs = () => {
  return (
    <Box>
      <Heading as="h2" size="lg" mb={4}>
        Inputs
      </Heading>
      <Text fontSize="lg" mb={6}>
        O componente Inputs é usado para capturar dados do usuário através de campos interativos como texto, seleção e botões.
      </Text>
      <Text fontSize="md">
        Esse componente pode ser usado para permitir que o usuário insira informações em formulários, com validações e estilos customizáveis para garantir a melhor experiência.
      </Text>
    </Box>
  );
};

export default BotaoInputsDocs;
