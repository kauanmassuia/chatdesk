import { Box, Heading, Text, Progress } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import PricingSection from "../PricingSection";
import { countAnswers } from "../../services/answerService";

interface CountAnswersResponse {
  current_answers: number;
  answer_limit: number;
  progress_percentage: number;
}

const UseAndPaymentButton = () => {
  const [currentAnswers, setCurrentAnswers] = useState(0);
  const [answerLimit, setAnswerLimit] = useState(0);
  const [progressPercentage, setProgressPercentage] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data: CountAnswersResponse = await countAnswers();
        setCurrentAnswers(data.current_answers);
        setAnswerLimit(data.answer_limit);
        setProgressPercentage(data.progress_percentage);
      } catch (error) {
        console.error("Erro ao buscar dados de uso:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <Box width="100%" pl={4} mt={-2}>
      {/* Seção de Uso */}
      <Heading size="md" mb={3}>Uso</Heading>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
        <Text fontSize="sm" fontWeight="medium">Chats</Text>
        <Text fontSize="xs" color="gray.500">Renova em 30/04/2025 </Text>
      </Box>
      {/* Barra de progresso dinâmica */}
      <Progress value={progressPercentage} size="sm" colorScheme="blue" borderRadius="full" />
      <Text fontSize="sm" mt={1} textAlign="right">{currentAnswers} / {answerLimit}</Text>

      {/* Seção do plano */}
      <Heading size="md" mt={5} mb={2}>Meu plano</Heading>
      <Text fontSize="sm" color="gray.600" mb={4}>
        Plano atual: <Text as="span" fontWeight="bold">Standard</Text>
      </Text>

      {/* Pricing Section */}
      <PricingSection />
    </Box>
  );
};

export default UseAndPaymentButton;
