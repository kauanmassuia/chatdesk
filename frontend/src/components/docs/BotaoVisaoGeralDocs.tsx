import { Box, Heading, Text } from "@chakra-ui/react";

const BotaoVisaoGeralDocs = () => {
  return (
    <Box>
      <Heading as="h2" size="lg" mb={4}>
        Visão Geral
      </Heading>
      <Text fontSize="lg" mb={6}>
        A visão geral fornece um resumo claro e conciso do sistema ou componente em questão. É uma introdução essencial que ajuda os usuários a entender o funcionamento básico e a estrutura do sistema.
      </Text>
      <Text fontSize="md">
        Em uma visão geral, são destacadas as principais funcionalidades, objetivos e áreas de aplicação, permitindo que o usuário se familiarize rapidamente com o que está sendo apresentado.
      </Text>
    </Box>
  );
};

export default BotaoVisaoGeralDocs;
