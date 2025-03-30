import { Box, Heading, Text } from "@chakra-ui/react";

const BotaoBubblesDocs = () => {
  return (
    <Box>
      <Heading as="h2" size="lg" mb={4}>
        Bubbles
      </Heading>
      <Text fontSize="lg" mb={6}>
        As bubbles são elementos interativos que podem ser adicionados dentro dos fluxos para aumentar a interação do usuário.
      </Text>
      <Text fontSize="md">
        Elas podem ser configuradas para exibir informações, apresentar escolhas ou até mesmo fazer parte de um processo mais complexo no fluxo.
      </Text>
    </Box>
  );
};

export default BotaoBubblesDocs;
