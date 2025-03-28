import { Box, Heading, Text } from "@chakra-ui/react";

const BotaoIncorporarDocs = () => {
  return (
    <Box>
      <Heading as="h2" size="lg" mb={4}>
        Incorporar
      </Heading>
      <Text fontSize="lg" mb={6}>
        O componente Incorporar permite que você insira conteúdo de fontes externas diretamente em seu aplicativo, como vídeos, áudios ou documentos, através de links de incorporação.
      </Text>
      <Text fontSize="md">
        Utilize este componente para oferecer uma experiência mais rica aos seus usuários, integrando conteúdos de plataformas externas, como YouTube ou Google Docs, diretamente no seu fluxo de aplicação.
      </Text>
    </Box>
  );
};

export default BotaoIncorporarDocs;
