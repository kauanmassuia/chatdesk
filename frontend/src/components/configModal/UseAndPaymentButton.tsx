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
import { countAnswers, CountAnswersResponse } from '../../services/answerService';
import PricingSectionModal from './PricingSectionModal';
import { getUserSubscription, SubscriptionResponse } from "../../services/subscriptionService";
import CancelSubscriptionButton from '../buttons/CancelSubscriptionButton';

const UseAndPaymentButton = () => {
  const [usageData, setUsageData] = useState<CountAnswersResponse | null>(null);
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionResponse | null>(null);

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

  useEffect(() => {
    fetchData();
  }, []);

  const bg = useColorModeValue('white', 'gray.700');

  if (!usageData || !subscriptionData) return null;

  const {
    total_answers,
    current_answers,
    answer_limit,
    progress_percentage,
  } = usageData;

  const {
    currentPlan,
    pendingPlan,
    translatedPlan,
    pendingTranslatedPlan,
    billing_start,
    billing_end,
    status
  } = subscriptionData;

  // Determine if there is a pending downgrade.
  const hasPendingDowngrade = pendingPlan && pendingPlan !== currentPlan;

  // Check if user has paid plan (not free)
  const hasPaidPlan = currentPlan !== 'free';

  return (
    <Box w="100%" px={{ base: 2, md: 4 }}>
      {/* Usage Section */}
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
              {current_answers} de {answer_limit} chats utilizados neste ciclo
            </Text>
          </HStack>
          <Progress
            value={progress_percentage}
            size="sm"
            colorScheme="blue"
            borderRadius="full"
          />
          <Text fontSize="xs" textAlign="right" color="gray.500">
            {progress_percentage.toFixed(1)}% utilizado
          </Text>
          <Text fontSize="xs" color="gray.500">
            Total chats: {total_answers}
          </Text>
        </Stack>
      </Box>

      {/* Subscription Plan Section */}
      <Box mb={8} p={4} borderRadius="lg" bg={bg} boxShadow="sm">
        <Heading size="md" mb={1}>
          Meu plano
        </Heading>
        <Text fontSize="sm" color="gray.600" mb={2}>
          Você está usando o plano{' '}
          <Text as="span" fontWeight="bold">
            {translatedPlan}
          </Text>.
        </Text>
        <Text fontSize="xs" color="gray.500">
          Ciclo atual: {new Date(billing_start).toLocaleDateString('pt-BR')} até{' '}
          {new Date(billing_end).toLocaleDateString('pt-BR')}
        </Text>

        {hasPendingDowngrade && (
          <Text fontSize="xs" color="red.500" mt={2}>
            Atenção: Seu plano será atualizado para{' '}
            <Text as="span" fontWeight="bold">
              {pendingTranslatedPlan || pendingPlan}
            </Text>{' '}
            a partir de {new Date(billing_end).toLocaleDateString('pt-BR')}.
          </Text>
        )}

        {/* Show cancel button only for paid plans with active status */}
        {hasPaidPlan && status === 'active' && !hasPendingDowngrade && (
          <CancelSubscriptionButton onSuccess={fetchData} />
        )}
      </Box>

      {/* Upgrade Section */}
      <PricingSectionModal />
    </Box>
  );
};

export default UseAndPaymentButton;
