import { Box, Heading, Text } from "@chakra-ui/react";

const BotaoCriandoFlowDocs = () => {
  return (
    <Box>
      <Heading as="h2" size="lg" mb={4}>
        Criando um Flow
      </Heading>
      <Text fontSize="lg" mb={6}>
        Para criar um fluxo, basta seguir alguns passos básicos para configurar as etapas e definir o comportamento de cada componente dentro do fluxo.
      </Text>
      <Text fontSize="md">
        Comece escolhendo os blocos que farão parte do seu fluxo, depois configure as transições entre eles para garantir que o fluxo funcione de forma contínua e intuitiva.
      </Text>
    </Box>
  );
};

export default BotaoCriandoFlowDocs;
