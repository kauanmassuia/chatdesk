import { Box, Heading, Text } from "@chakra-ui/react";

const BotaoTextoDocs = () => {
  return (
    <Box>
      <Heading as="h2" size="lg" mb={4}>
        Texto
      </Heading>
      <Text fontSize="lg" mb={6}>
        O componente Texto é utilizado para exibir informações simples e estáticas na interface. Ele pode ser utilizado para mostrar títulos, descrições ou qualquer outro tipo de conteúdo textual.
      </Text>
      <Text fontSize="md">
        Esse componente é essencial para a comunicação de dados visuais ao usuário, sendo altamente configurável para diferentes tipos de fontes e estilos.
      </Text>
    </Box>
  );
};

export default BotaoTextoDocs;
