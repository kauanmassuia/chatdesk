import { useState } from "react";
import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import SidebarDocs from "../../components/docs/SidebarDocs";
import HeaderDocs from "../../components/docs/HeaderDocs";
import BotaoBemVindoDocs from "../../components/docs/BotaoBemVindoDocs";
import BotaoCriandoFlowDocs from "../../components/docs/BotaoCriandoFlowDocs";
import BotaoBlocosDocs from "../../components/docs/BotaoBlocosDocs";
import BotaoVisaoGeralDocs from "../../components/docs/BotaoVisaoGeralDocs";
import BotaoBubblesDocs from "../../components/docs/BotaoBubblesDocs";
import BotaoTextoDocs from "../../components/docs/BotaoTextoDocs";
import BotaoImagemDocs from "../../components/docs/BotaoImagemDocs";
import BotaoVideoDocs from "../../components/docs/BotaoVideoDocs";
import BotaoIncorporarDocs from "../../components/docs/BotaoIncorporarDocs";
import BotaoAudioDocs from "../../components/docs/BotaoAudioDocs";
import BotaoInputsDocs from "../../components/docs/BotaoInputsDocs";
import BotaoNumeroDocs from "../../components/docs/BotaoNumeroDocs";
import BotaoEmailDocs from "../../components/docs/BotaoEmailDocs";
import BotaoWebsiteDocs from "../../components/docs/BotaoWebsiteDocs";
import BotaoDataDocs from "../../components/docs/BotaoDataDocs";
import BotaoAtrasoDocs from "../../components/docs/BotaoAtrasoDocs";
import BotaoTelefoneDocs from "../../components/docs/BotaoTelefoneDocs";
import BotaoBotoesDocs from "../../components/docs/BotaoBotoesDocs";
import BotaoImagemInputsDocs from "../../components/docs/BotaoImagemInputsDocs";
import BotaoPagamentoDocs from "../../components/docs/BotaoPagamentoDocs";

function Docs() {
  const [content, setContent] = useState("Selecione uma opção no menu...");

  const handleButtonClick = (buttonContent: string) => {
    setContent(buttonContent);
  };

  const renderContent = () => {
    switch (content) {
      case "Bem-vindo":
        return <BotaoBemVindoDocs onClick={() => console.log("Bem-vindo button clicked")} />;
      case "Criando um Flow":
        return <BotaoCriandoFlowDocs />;
      case "Blocos":
        return <BotaoBlocosDocs />;
      case "Visão Geral":
        return <BotaoVisaoGeralDocs />;
      case "Bubbles":
        return <BotaoBubblesDocs />;
      case "Texto":
        return <BotaoTextoDocs />;
      case "Imagem":
        return <BotaoImagemDocs />;
      case "Vídeo":
        return <BotaoVideoDocs />;
      case "Incorporar":
        return <BotaoIncorporarDocs />;
      case "Áudio":
        return <BotaoAudioDocs />;
      case "Inputs":
        return <BotaoInputsDocs />;
      case "Número":
        return <BotaoNumeroDocs />;
      case "E-mail":
        return <BotaoEmailDocs />;
      case "Website":
        return <BotaoWebsiteDocs />;
      case "Data":
        return <BotaoDataDocs />;
      case "Atraso":
        return <BotaoAtrasoDocs />;
      case "Telefone":
        return <BotaoTelefoneDocs />;
      case "Botões":
        return <BotaoBotoesDocs />;
      case "Imagem Inputs":
        return <BotaoImagemInputsDocs />;
      case "Pagamento":
        return <BotaoPagamentoDocs />;
      default:
        return (
          <Text fontSize="lg" mb={6}>
            Selecione uma opção no menu para visualizar o conteúdo.
          </Text>
        );
    }
  };

  return (
    <Flex direction="column" h="100vh" bg="#f1f1f1">
      <HeaderDocs />

      <Flex direction="row" flex="1" mt="115px" position="relative">
        <Box
          as="aside"
          position="fixed"
          top="80px"
          left="0"
          height="calc(100vh - 80px)"
          zIndex="1"
          bg="#fff"
          width="250px"
        >
          <SidebarDocs setContent={handleButtonClick} />
        </Box>

        <Box 
          className="main-content" 
          flex={1} 
          p={8} 
          ml="250px" 
          overflowY="auto" 
          borderLeft="2px solid #E2E8F0" 
          bg="#f1f1f1"
        >
          <Heading as="h1" size="xl" mb={6} className="main-title">
            {content}
          </Heading>
          {renderContent()}
        </Box>
      </Flex>
    </Flex>
  );
}

export default Docs;
