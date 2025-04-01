import { Box, Button, VStack, Collapse } from "@chakra-ui/react";
import { useState } from "react";
import { 
  FaHome, 
  FaRegFileAlt, 
  FaCogs, 
  FaListAlt, 
  FaUsers, 
  FaClipboardList, 
  FaImage, 
  FaVideo, 
  FaHeadphones, 
  FaEdit, 
  FaChevronRight, 
  FaChevronUp 
} from "react-icons/fa"; // Ícones de setas adicionados

interface SidebarDocsProps {
  setContent: (content: string) => void;
}

function SidebarDocs({ setContent }: SidebarDocsProps) {
  const [openFluxo, setOpenFluxo] = useState(false);  // Controla a exibição do Fluxo
  const [openBubbles, setOpenBubbles] = useState(false);  // Controla a exibição das Bubbles
  const [openInputs, setOpenInputs] = useState(false);  // Controla a exibição dos Inputs
  const [isOpen, setIsOpen] = useState(true); // Controla a visibilidade da sidebar em telas pequenas
  const sidebarWidth = "250px"; // Largura fixa da sidebar

  return (
    <Box
      as="nav"
      position="fixed"
      left="0"
      height="100%"
      width={sidebarWidth}
      bg="#f8f9fa" // Cor de fundo alterada
      boxShadow="sm"
      overflowY="auto"
      zIndex="10" // Garante que a sidebar fique acima de outros elementos
      transition="all 0.3s ease" // Para transições suaves
      display={{ base: isOpen ? "block" : "none", md: "block" }} // Controla visibilidade em telas pequenas
      flexDirection={"column"}   
    >
      <VStack align="start" spacing={4} p={4} marginTop={"24px"} maxH={"100%"} overflowY={"auto"} flexGrow={1} marginBottom={"80px"}>
        {/* Título Começar */}
        <Button 
          variant="ghost" 
          onClick={() => setContent("Bem-vindo")}
          leftIcon={<FaHome />}
          justifyContent="flex-start"
          _hover={{ bg: "#e0e0e0" }}
          color="#34302E"
          fontWeight="normal"
          fontSize="md"
          w="full"
          
        >
          Bem-vindo
        </Button>

        <Button 
          variant="ghost" 
          onClick={() => setContent("Criando um Flow")}
          leftIcon={<FaRegFileAlt />}
          justifyContent="flex-start"
          _hover={{ bg: "#e0e0e0" }}
          color="#34302E"
          fontWeight="normal"
          fontSize="md"
          w="full"
        >
          Criando um Flow
        </Button>

        {/* Título Fluxo */}
        <Button 
          variant="ghost" 
          onClick={() => setOpenFluxo(!openFluxo)}  // Alterna a visibilidade do Fluxo
          leftIcon={<FaCogs />}
          rightIcon={openFluxo ? <FaChevronUp /> : <FaChevronRight />} // Seta para cima ou para a direita dependendo do estado
          justifyContent="flex-start"
          _hover={{ bg: "#e0e0e0" }}
          color="#34302E"
          fontWeight="normal"
          fontSize="md"
          w="full"
        >
          Fluxo
        </Button>
        <Collapse in={openFluxo}>
          <VStack align="start" spacing={2} pl={6}>
            {/* Subtópicos de Fluxo */}
            <Button 
              variant="ghost" 
              onClick={() => setContent("Blocos")}
              leftIcon={<FaClipboardList />}
              justifyContent="flex-start"
              _hover={{ bg: "#e0e0e0" }}
              color="#34302E"
              fontWeight="normal"
              fontSize="md"
              w="full"
            >
              Blocos
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => setOpenBubbles(!openBubbles)}  // Alterna a visibilidade de Bubbles
              leftIcon={<FaListAlt />}
              rightIcon={openBubbles ? <FaChevronUp /> : <FaChevronRight />} // Seta para cima ou para a direita dependendo do estado
              justifyContent="flex-start"
              _hover={{ bg: "#e0e0e0" }}
              color="#34302E"
              fontWeight="normal"
              fontSize="md"
              w="full"
            >
              Bubbles
            </Button>
            <Collapse in={openBubbles}>
              <VStack align="start" spacing={2} pl={6}>
                <Button 
                  variant="ghost" 
                  onClick={() => setContent("Texto")}
                  leftIcon={<FaEdit />}
                  justifyContent="flex-start"
                  _hover={{ bg: "#e0e0e0" }}
                  color="#34302E"
                  fontWeight="normal"
                  fontSize="md"
                  w="full"
                >
                  Texto
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={() => setContent("Imagem")}
                  leftIcon={<FaImage />}
                  justifyContent="flex-start"
                  _hover={{ bg: "#e0e0e0" }}
                  color="#34302E"
                  fontWeight="normal"
                  fontSize="md"
                  w="full"
                >
                  Imagem
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={() => setContent("Vídeo")}
                  leftIcon={<FaVideo />}
                  justifyContent="flex-start"
                  _hover={{ bg: "#e0e0e0" }}
                  color="#34302E"
                  fontWeight="normal"
                  fontSize="md"
                  w="full"
                >
                  Vídeo
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={() => setContent("Incorporar")}
                  leftIcon={<FaClipboardList />}
                  justifyContent="flex-start"
                  _hover={{ bg: "#e0e0e0" }}
                  color="#34302E"
                  fontWeight="normal"
                  fontSize="md"
                  w="full"
                >
                  Incorporar
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={() => setContent("Áudio")}
                  leftIcon={<FaHeadphones />}
                  justifyContent="flex-start"
                  _hover={{ bg: "#e0e0e0" }}
                  color="#34302E"
                  fontWeight="normal"
                  fontSize="md"
                  w="full"
                >
                  Áudio
                </Button>
              </VStack>
            </Collapse>

            <Button 
              variant="ghost" 
              onClick={() => setOpenInputs(!openInputs)}  // Alterna a visibilidade dos Inputs
              leftIcon={<FaUsers />}
              rightIcon={openInputs ? <FaChevronUp /> : <FaChevronRight />} // Seta para cima ou para a direita dependendo do estado
              justifyContent="flex-start"
              _hover={{ bg: "#e0e0e0" }}
              color="#34302E"
              fontWeight="normal"
              fontSize="md"
              w="full"
            >
              Inputs
            </Button>
            <Collapse in={openInputs}>
              <VStack align="start" spacing={2} pl={6}>
                <Button 
                  variant="ghost" 
                  onClick={() => setContent("Texto Input")}
                  leftIcon={<FaEdit />}
                  justifyContent="flex-start"
                  _hover={{ bg: "#e0e0e0" }}
                  color="#34302E"
                  fontWeight="normal"
                  fontSize="md"
                  w="full"
                >
                  Texto
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={() => setContent("Número")}
                  leftIcon={<FaEdit />}
                  justifyContent="flex-start"
                  _hover={{ bg: "#e0e0e0" }}
                  color="#34302E"
                  fontWeight="normal"
                  fontSize="md"
                  w="full"
                >
                  Número
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={() => setContent("E-mail")}
                  leftIcon={<FaUsers />}
                  justifyContent="flex-start"
                  _hover={{ bg: "#e0e0e0" }}
                  color="#34302E"
                  fontWeight="normal"
                  fontSize="md"
                  w="full"
                >
                  E-mail
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={() => setContent("Website")}
                  leftIcon={<FaUsers />}
                  justifyContent="flex-start"
                  _hover={{ bg: "#e0e0e0" }}
                  color="#34302E"
                  fontWeight="normal"
                  fontSize="md"
                  w="full"
                >
                  Website
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={() => setContent("Data")}
                  leftIcon={<FaUsers />}
                  justifyContent="flex-start"
                  _hover={{ bg: "#e0e0e0" }}
                  color="#34302E"
                  fontWeight="normal"
                  fontSize="md"
                  w="full"
                >
                  Data
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={() => setContent("Telefone")}
                  leftIcon={<FaUsers />}
                  justifyContent="flex-start"
                  _hover={{ bg: "#e0e0e0" }}
                  color="#34302E"
                  fontWeight="normal"
                  fontSize="md"
                  w="full"
                >
                  Telefone
                </Button>
              </VStack>
            </Collapse>
          </VStack>
        </Collapse>
      </VStack>
    </Box>
  );
}

export default SidebarDocs;
