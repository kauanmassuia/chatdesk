import { Box, Heading, Text } from "@chakra-ui/react";

const BotaoWebsiteDocs = () => {
  return (
    <Box>
      <Heading as="h2" size="lg" mb={4}>
        Website
      </Heading>
      <Text fontSize="lg" mb={6}>
        O recurso de Website permite integrar links e páginas externas ao sistema, oferecendo uma maneira eficiente de direcionar os usuários para sites relevantes e informações adicionais.
      </Text>
      <Text fontSize="md">
        Ao usar este recurso, você pode embutir links que facilitam o acesso a conteúdos externos diretamente dentro do ambiente do sistema.
      </Text>
    </Box>
  );
};

export default BotaoWebsiteDocs;
