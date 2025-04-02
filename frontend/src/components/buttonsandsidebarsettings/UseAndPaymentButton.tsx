import { Box, Heading, Text, Progress } from "@chakra-ui/react";
import PricingSection from '../PricingSection';

interface UseAndPaymentButtonProps {
  onClick: () => void;
  isActive?: boolean; 
}

const UseAndPaymentButton = () => {
  return (
    <Box width="100%" pl={4} mt={-2}>
      {/* Seção de Uso */}
      <Heading size="md" mb={3}>Uso</Heading>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
        <Text fontSize="sm" fontWeight="medium">Chats</Text>
        <Text fontSize="xs" color="gray.500">Renova em 30/04/2025</Text>
      </Box>
      {/* Barra de progresso */}
      <Progress value={(32 / 200) * 100} size="sm" colorScheme="blue" borderRadius="full" />
      <Text fontSize="sm" mt={1} textAlign="right">32 / 200</Text>

      {/* Seção do plano */}
      <Heading size="md" mt={5} mb={2}>Meu plano</Heading>
      <Text fontSize="sm" color="gray.600" mb={4}>Plano atual: <Text as="span" fontWeight="bold">Standard</Text></Text>

      {/* Pricing Section */}
      <PricingSection />
    </Box>
  );
};

export default UseAndPaymentButton;
