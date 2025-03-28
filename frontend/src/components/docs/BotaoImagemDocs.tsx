import { Box, Heading, Text } from "@chakra-ui/react";

const BotaoImagemDocs = () => {
  return (
    <Box>
      <Heading as="h2" size="lg" mb={4}>
        Imagem
      </Heading>
      <Text fontSize="lg" mb={6}>
        O componente de imagem é usado para inserir imagens nos fluxos, proporcionando uma forma visual de interação.
      </Text>
      <Text fontSize="md">
        Você pode utilizar imagens em vários formatos, como PNG, JPEG, ou SVG, para enriquecer a experiência do usuário. Para adicionar uma imagem, basta especificar o caminho correto no servidor ou fornecer uma URL.
      </Text>
    </Box>
  );
};

export default BotaoImagemDocs;
