import { Box, Heading, Text } from "@chakra-ui/react";

const BotaoEmailDocs = () => {
  return (
    <Box>
      <Heading as="h2" size="lg" mb={4}>
        E-mail
      </Heading>
      <Text fontSize="lg" mb={6}>
        O e-mail é um dos componentes fundamentais para comunicação dentro de um fluxo. Ele pode ser utilizado para enviar notificações ou confirmações automáticas.
      </Text>
      <Text fontSize="md">
        Para integrar um e-mail, é importante configurar o servidor de envio e as condições que dispararão o envio da mensagem, como dados do usuário ou ações específicas.
      </Text>
    </Box>
  );
};

export default BotaoEmailDocs;
