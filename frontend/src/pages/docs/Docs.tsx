import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import SidebarDocs from "../../components/docs/SidebarDocs";
import HeaderDocs from "../../components/docs/HeaderDocs";  
import "../../styles/docs.css"; // Mantendo o estilo externo

function Docs() {
  return (
    <Flex direction="column" h="100vh" bg="#f1f1f1"> {/* Adicionado bg="#f1f1f1" */}
      {/* Header */}
      <HeaderDocs />

      {/* Main Flex container for Sidebar and Content */}
      <Flex direction="row" flex="1">
        {/* Sidebar */}
        <SidebarDocs />

        {/* Main Content */}
        <Box className="main-content" flex={1} p={8} overflowY="auto" borderLeft="2px solid #E2E8F0" bg="#f1f1f1"> {/* Fundo igual ao header/sidebar */}
          <Heading as="h1" size="xl" mb={6} className="main-title">
            Welcome to the Documentation!
          </Heading>
          <Text fontSize="lg" mb={6} className="main-description">
            This is the place where you can find all the necessary information about the system. Use the sidebar to navigate through the documentation. Here is a general overview:
          </Text>
          <Text fontSize="md" mb={6}>
            The documentation is divided into several sections to help you get started with the project, understand the API, and troubleshoot any issues that might arise. You can also use the search bar in the header to quickly find topics or keywords you're interested in.
          </Text>
        </Box>
      </Flex>
    </Flex>
  );
}

export default Docs;
