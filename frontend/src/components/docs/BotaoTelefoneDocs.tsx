import { Box, Heading, Text } from "@chakra-ui/react";

const BotaoTelefoneDocs = () => {
  return (
    <Box>
      <Heading as="h2" size="lg" mb={4}>
        Telefone
      </Heading>
      <Text fontSize="lg" mb={6}>
        O componente Telefone é usado para capturar números de telefone no sistema. Ele pode ser configurado para aceitar formatos de número válidos, como (XX) XXXX-XXXX ou outros formatos de número internacional.
      </Text>
      <Text fontSize="md">
        Este componente é muito útil em formulários de cadastro, suporte ao cliente ou qualquer outro fluxo que exija informações de contato via telefone.
      </Text>
    </Box>
  );
};

export default BotaoTelefoneDocs;
