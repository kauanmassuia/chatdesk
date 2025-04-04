import {
  Box,
  Heading,
  Text,
  Progress,
  Stack,
  Badge,
  useColorModeValue,
  HStack,
  Icon,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { FaRegChartBar } from 'react-icons/fa';
import { countAnswers } from '../../services/answerService';
import PricingSectionModal from './PricingSectionModal';
import { getUserSubscription } from "../../services/subscriptionService";

interface CountAnswersResponse {
  current_answers: number;
  answer_limit: number;
  progress_percentage: number;
}

interface SubscriptionData {
  plan: 'free' | 'standard' | 'premium';
  translatedPlan: 'Grátis' | 'Básico' | 'Premium';
  status: 'active' | 'canceled' | 'trialing';
  billing_start: string;
  billing_end: string;
}

const UseAndPaymentButton = () => {
  const [usageData, setUsageData] = useState<CountAnswersResponse | null>(null);
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usage, subscription] = await Promise.all([
          countAnswers(),
          getUserSubscription(),
        ]);
        setUsageData(usage);
        setSubscriptionData(subscription);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }
    };

    fetchData();
  }, []);

  const bg = useColorModeValue('white', 'gray.700');

  if (!usageData || !subscriptionData) return null;

  const {
    current_answers,
    answer_limit,
    progress_percentage,
  } = usageData;

  const {
    translatedPlan,
    billing_start,
    billing_end,
  } = subscriptionData;

  return (
    <Box w="100%" px={{ base: 2, md: 4 }}>
      {/* Seção de Uso */}
      <Box mb={8} p={4} borderRadius="lg" bg={bg} boxShadow="sm">
        <HStack justifyContent="space-between" mb={2}>
          <Heading size="md">Uso do plano</Heading>
          <Badge colorScheme="blue" fontSize="0.8em">
            Renova em {new Date(billing_end).toLocaleDateString('pt-BR')}
          </Badge>
        </HStack>

        <Stack spacing={1} mb={3}>
          <HStack fontSize="sm" color="gray.600">
            <Icon as={FaRegChartBar} />
            <Text>
              {current_answers} de {answer_limit} chats utilizados
            </Text>
          </HStack>
          <Progress
            value={progress_percentage}
            size="sm"
            colorScheme="blue"
            borderRadius="full"
          />
          <Text fontSize="xs" textAlign="right" color="gray.500">
            {progress_percentage.toFixed(1)}% usado
          </Text>
        </Stack>
      </Box>

      {/* Seção de Plano */}
      <Box mb={8} p={4} borderRadius="lg" bg={bg} boxShadow="sm">
        <Heading size="md" mb={1}>
          Meu plano
        </Heading>
        <Text fontSize="sm" color="gray.600" mb={2}>
          Você está usando o plano{' '}
          <Text as="span" fontWeight="bold">{translatedPlan}</Text>
        </Text>
        <Text fontSize="xs" color="gray.500">
          Ciclo atual: {new Date(billing_start).toLocaleDateString('pt-BR')} até{' '}
          {new Date(billing_end).toLocaleDateString('pt-BR')}
        </Text>
      </Box>

      {/* Seção de Upgrade */}
      <PricingSectionModal />
    </Box>
  );
};

export default UseAndPaymentButton;
