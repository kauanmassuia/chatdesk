import { Box, Button, Heading, Stack } from "@chakra-ui/react";

interface SidebarProps {
  setActivePage: (page: string) => void;
}

const SidebarSettings: React.FC<SidebarProps> = ({ setActivePage }) => {
  return (
    <Box width="100%" borderRadius="lg">
      <Heading size="sm" mb={4}>
        Conta
      </Heading>

      <Stack spacing={2}>
        <Button
          variant="ghost"
          width="100%"
          justifyContent="flex-start"
          onClick={() => setActivePage("config")}
        >
          Kauan Massuia
        </Button>

        <Button
          variant="ghost"
          width="100%"
          justifyContent="flex-start"
          onClick={() => setActivePage("payment")}
        >
          Pagamento e Uso
        </Button>
      </Stack>
    </Box>
  );
};

export default SidebarSettings;
