import { Box, Heading, Text } from "@chakra-ui/react";

const BotaoBemVindoDocs = () => {
  return (
    <Box>
      <Heading as="h2" size="lg" mb={4}>
        Bem-vindo ao Docs!
      </Heading>
      <Text fontSize="lg" mb={6}>
        Este é o início da sua jornada no nosso sistema. Aqui você encontrará todas as informações e tutoriais necessários para começar a usar nossa plataforma de forma eficaz.
      </Text>
      <Text fontSize="md">
        Explore os tópicos no menu à esquerda para aprender sobre os diversos recursos disponíveis e como utilizá-los para melhorar sua experiência.
      </Text>
    </Box>
  );
};

export default BotaoBemVindoDocs;
