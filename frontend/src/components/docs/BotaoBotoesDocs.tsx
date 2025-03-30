import { Box, Heading, Text } from "@chakra-ui/react";

const BotaoBotoesDocs = () => {
  return (
    <Box>
      <Heading as="h2" size="lg" mb={4}>
        Botões
      </Heading>
      <Text fontSize="lg" mb={6}>
        Os botões são elementos interativos fundamentais para a navegação do usuário em seu fluxo.
      </Text>
      <Text fontSize="md">
        Para adicionar botões, basta configurar as propriedades do botão como a cor, o tipo e a ação que deve ser executada ao ser clicado.
      </Text>
    </Box>
  );
};

export default BotaoBotoesDocs;
