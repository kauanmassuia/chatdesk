import { Box, Heading, Text } from "@chakra-ui/react";

const BotaoVideoDocs = () => {
  return (
    <Box>
      <Heading as="h2" size="lg" mb={4}>
        Vídeo
      </Heading>
      <Text fontSize="lg" mb={6}>
        O componente Vídeo permite a integração e exibição de conteúdo de vídeo diretamente na interface. Este componente é útil para demonstrar tutoriais, apresentações ou conteúdos multimídia interativos.
      </Text>
      <Text fontSize="md">
        O vídeo pode ser incorporado de diversas formas, como de fontes externas ou arquivos locais, e é altamente personalizável em termos de controles de reprodução e tamanhos de exibição.
      </Text>
    </Box>
  );
};

export default BotaoVideoDocs;
