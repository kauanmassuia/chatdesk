import { Box, Heading, Text } from "@chakra-ui/react";

const BotaoAtrasoDocs = () => {
  return (
    <Box>
      <Heading as="h2" size="lg" mb={4}>
        Atraso
      </Heading>
      <Text fontSize="lg" mb={6}>
        O atraso no fluxo pode ocorrer por diversos fatores, como falhas de comunicação ou configurações incorretas. Aqui estão algumas possíveis causas e soluções.
      </Text>
      <Text fontSize="md">
        Certifique-se de que todos os componentes estão configurados corretamente e que as conexões estão sendo feitas de maneira adequada. Caso o atraso persista, verifique os logs de erro ou entre em contato com o suporte.
      </Text>
    </Box>
  );
};

export default BotaoAtrasoDocs;
