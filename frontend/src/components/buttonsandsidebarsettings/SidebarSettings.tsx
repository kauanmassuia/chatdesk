import { Box, Button, Heading } from "@chakra-ui/react";

interface SidebarProps {
    setActivePage: (page: string) => void;
}

const SidebarSettings: React.FC<SidebarProps> = ({ setActivePage }) => {
    return (
        <Box
            width="24%"
            borderRight="1px solid"
            borderColor="gray.200"
            p={4}
            position="absolute"
            top="0"
            left="0"
            height="100%"
            background="white"
            zIndex="10"
            borderRadius="md" // Added borderRadius
        >
            <Heading size="sm" mb={4}>Conta</Heading>
            
            <Button variant="ghost" width="100%" justifyContent="flex-start" onClick={() => setActivePage("config")}>
                Kauan Massuia 
            </Button>

            <Button variant="ghost" width="100%" justifyContent="flex-start" onClick={() => setActivePage("payment")}>
                Pagamento e Uso
            </Button>
        </Box>
    );
};

export default SidebarSettings;
