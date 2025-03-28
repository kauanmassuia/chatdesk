import { Box, Heading, Text } from "@chakra-ui/react";

const BotaoDataDocs = () => {
  return (
    <Box>
      <Heading as="h2" size="lg" mb={4}>
        Data
      </Heading>
      <Text fontSize="lg" mb={6}>
        A data é um dos componentes essenciais para definir quando uma ação ou evento deve ocorrer dentro de um fluxo.
      </Text>
      <Text fontSize="md">
        Utilize a data para definir o momento exato em que um processo ou interação deve ser acionado, garantindo que as condições temporais sejam atendidas de maneira precisa.
      </Text>
    </Box>
  );
};

export default BotaoDataDocs;
