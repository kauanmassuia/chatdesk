import { Box, Heading, Text } from "@chakra-ui/react";

const BotaoPagamentoDocs = () => {
  return (
    <Box>
      <Heading as="h2" size="lg" mb={4}>
        Pagamento
      </Heading>
      <Text fontSize="lg" mb={6}>
        O componente Pagamento é utilizado para integrar formas de pagamento no sistema. Ele pode ser configurado para aceitar diversos métodos, como cartão de crédito, boleto bancário e outros.
      </Text>
      <Text fontSize="md">
        Este componente é essencial para criar fluxos de pagamento seguros e eficientes em plataformas de e-commerce ou outros sistemas que envolvam transações financeiras.
      </Text>
    </Box>
  );
};

export default BotaoPagamentoDocs;
