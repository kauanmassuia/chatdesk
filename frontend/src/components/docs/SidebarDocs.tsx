import { Box, Flex, Button } from "@chakra-ui/react";

const SidebarDocs = () => {
  return (
    <Flex
      as="aside"
      direction="column"
      bg="#f1f1f1" // Fundo da Sidebar
      p={4}
      w="250px"
      borderRight="2px solid #E2E8F0" // Borda direita, mesma cor do header
      height="100vh" // Para garantir que a sidebar ocupe toda a altura
    >
      <Button variant="ghost" mb={4}>Home</Button>
      <Button variant="ghost" mb={4}>About</Button>
      <Button variant="ghost" mb={4}>Docs</Button>
    </Flex>
  );
};

export default SidebarDocs;
