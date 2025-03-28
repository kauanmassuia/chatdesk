import { Box, Heading, Text } from "@chakra-ui/react";

const BotaoNumeroDocs = () => {
  return (
    <Box>
      <Heading as="h2" size="lg" mb={4}>
        Número
      </Heading>
      <Text fontSize="lg" mb={6}>
        O componente Número é utilizado para capturar e validar números inseridos pelo usuário. Ele pode ser configurado para permitir diferentes tipos de entrada, como números inteiros, decimais, com ou sem sinais.
      </Text>
      <Text fontSize="md">
        Esse componente é útil quando você precisa de um campo que restringe a entrada para valores numéricos e pode ser integrado a funcionalidades como cálculos, validações de limites e muito mais.
      </Text>
    </Box>
  );
};

export default BotaoNumeroDocs;
