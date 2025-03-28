// components/Docs/HeaderDocs.tsx
import { Flex, Image, Input, Button } from "@chakra-ui/react";

const HeaderDocs = () => {
  return (
    <Flex 
      as="header" 
      bg="#f1f1f1"  // Fundo do header
      color="black" 
      p={4} 
      align="center" 
      justify="space-between"
      w="100%" 
      borderBottom="2px solid #E2E8F0" // Borda inferior entre o header e os outros elementos
      position="fixed" // Tornando o header fixo
      top={0} // Colocando no topo da página
      left={0}
      zIndex={10} // Para garantir que fique acima do conteúdo
    >
      <Image 
        src="../src/assets/logovendflow.png" 
        alt="Logo" 
        width="180px"  // Largura aumentada
        height="auto"  // Mantendo a proporção da altura
      />

      <Input 
        placeholder="Procurar..." 
        bg="white" 
        color="black"
        borderRadius="full"
        px={2} 
        fontSize="sm"
        w="300px"  // Largura maior
        h="50px"   // Aumento de altura
        borderWidth="2px"  // Borda mais grossa
        borderColor="gray.300"  // Cor da borda
        sx={{
          width: "500px !important",
          height: "45px !important",
          maxWidth: "1000px !important",
          minWidth: "300px !important",
          paddingInlineStart: "0.5rem",
          paddingInlineEnd: "0.5rem",
        }}
        _focusVisible={{
          borderColor: "gray.300", 
          boxShadow: "none", // Retirando sombra
        }}
      />

      <Button
        bg="#FF9E2C"  // Cor do botão
        color="white"  // Cor da fonte
        size="sm"
        w="150px"  // Largura do botão
        h="50px"   // Altura do botão
        borderRadius="md"  // Bordas arredondadas
        fontSize="md"  // Tamanho de fonte
        sx={{
          width: "130px", // Personalizando largura
          height: "50px", // Personalizando altura
          fontSize: "16px", // Personalizando tamanho de fonte
        }}
        _hover={{
          bg: "#FF7F00",  // Cor de fundo no hover
          transform: "scale(1.05)",  // Aumenta o botão no hover
          boxShadow: "md",  // Sombra no hover
        }}
        _active={{
          bg: "#FF6600",  // Cor de fundo no click
        }}
        _focus={{
          boxShadow: "outline",  // Sombra do foco
        }}
      >
        Dashboard
      </Button>
    </Flex>
  );
};

export default HeaderDocs;
