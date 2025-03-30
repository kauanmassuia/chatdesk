import { Box, Heading, Text } from "@chakra-ui/react";

const BotaoBlocosDocs = () => {
  return (
    <Box>
      <Heading as="h2" size="lg" mb={4}>
        Blocos
      </Heading>
      <Text fontSize="lg" mb={6}>
        Os blocos são os elementos fundamentais dentro de um fluxo. Cada bloco possui uma função específica que pode ser personalizada conforme as necessidades do usuário.
      </Text>
      <Text fontSize="md">
        Você pode configurar e organizar os blocos de maneira flexível para construir o fluxo desejado. A integração de blocos com outros componentes é essencial para um fluxo bem estruturado.
      </Text>
    </Box>
  );
};

export default BotaoBlocosDocs;
