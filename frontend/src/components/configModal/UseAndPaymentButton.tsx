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
  VStack,
  Flex,
  Spinner,
  Center
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { FaRegChartBar } from 'react-icons/fa';
import { countAnswers, CountAnswersResponse } from '../../services/answerService';
import PricingSectionModal from './PricingSectionModal';
import { getUserSubscription, SubscriptionResponse } from "../../services/subscriptionService";
import CancelSubscriptionButton from '../buttons/CancelSubscriptionButton';
import React from 'react';

const UseAndPaymentButton = () => {
  const [usageData, setUsageData] = useState<CountAnswersResponse | null>(null);
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionResponse | null>(null);
  const [loading, setLoading] = useState(true);

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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  if (loading) {
    return (
      <Center height="100%">
        <Spinner size="xl" thickness="4px" speed="0.65s" color="blue.500" />
      </Center>
    );
  }

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

  const hasPendingDowngrade = pendingPlan && pendingPlan !== currentPlan;
  const hasPaidPlan = currentPlan !== 'free';

  return (
    <Box width="100%" height="100%" overflowY="auto">
      <VStack spacing={6} align="stretch">
        {/* Uso do plano */}
        <Box
          p={{ base: 4, md: 5 }}
          borderRadius="lg"
          bg={bg}
          boxShadow="sm"
          borderWidth="1px"
          borderColor={borderColor}
        >
          <Flex
            justifyContent="space-between"
            alignItems={{ base: "flex-start", sm: "center" }}
            flexDirection={{ base: "column", sm: "row" }}
            gap={{ base: 2, sm: 0 }}
            mb={3}
          >
            <Heading size="md">Uso do plano</Heading>
            <Badge colorScheme="blue" fontSize="0.8em" borderRadius="md" px={2} py={1}>
              Renova em {new Date(billing_end).toLocaleDateString('pt-BR')}
            </Badge>
          </Flex>

          <Stack spacing={2} mb={2}>
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
            <Flex justifyContent="space-between" fontSize="xs" color="gray.500">
              <Text>Total chats: {total_answers}</Text>
              <Text>{progress_percentage.toFixed(1)}% utilizado</Text>
            </Flex>
          </Stack>
        </Box>

        {/* Plano atual */}
        <Box
          p={{ base: 4, md: 5 }}
          borderRadius="lg"
          bg={bg}
          boxShadow="sm"
          borderWidth="1px"
          borderColor={borderColor}
        >
          <Heading size="md" mb={2}>Meu plano</Heading>
          <Text fontSize="sm" mb={1}>
            Você está usando o plano{' '}
            <Text as="span" fontWeight="bold">{translatedPlan}</Text>.
          </Text>
          <Text fontSize="xs" color="gray.500" mb={3}>
            Ciclo atual: {new Date(billing_start).toLocaleDateString('pt-BR')} até{' '}
            {new Date(billing_end).toLocaleDateString('pt-BR')}
          </Text>

          {hasPendingDowngrade && (
            <Box
              mt={2}
              mb={3}
              p={3}
              borderRadius="md"
              bg={useColorModeValue("red.50", "red.900")}
              borderWidth="1px"
              borderColor={useColorModeValue("red.100", "red.700")}
            >
              <Text fontSize="sm" color={useColorModeValue("red.600", "red.200")}>
                Atenção: Seu plano será atualizado para{' '}
                <Text as="span" fontWeight="bold">
                  {pendingTranslatedPlan || pendingPlan}
                </Text>{' '}
                a partir de {new Date(billing_end).toLocaleDateString('pt-BR')}.
              </Text>
            </Box>
          )}

          {hasPaidPlan && status === 'active' && !hasPendingDowngrade && (
            <Box mt={2}>
              <CancelSubscriptionButton onSuccess={fetchData} />
            </Box>
          )}
        </Box>

        {/* Upgrade Section */}
        <Box>
          <PricingSectionModal />
        </Box>
      </VStack>
    </Box>
  );
};

export default UseAndPaymentButton;
