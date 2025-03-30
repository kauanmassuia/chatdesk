import { Box, Heading, Text } from "@chakra-ui/react";

const BotaoAudioDocs = () => {
  return (
    <Box>
      <Heading as="h2" size="lg" mb={4}>
        Áudio
      </Heading>
      <Text fontSize="lg" mb={6}>
        O áudio é um dos componentes importantes no fluxo, permitindo que o sistema se comunique de maneira mais dinâmica com o usuário.
      </Text>
      <Text fontSize="md">
        Para adicionar áudio ao fluxo, basta configurar o componente de áudio corretamente. Verifique a qualidade do arquivo de áudio e a compatibilidade do formato para garantir que a experiência do usuário seja a melhor possível.
      </Text>
    </Box>
  );
};

export default BotaoAudioDocs;
