import {
  Box,
  Button,
  Heading,
  Stack,
  Text,
  SimpleGrid,
  Badge,
  Tooltip,
  useBreakpointValue,
  useColorModeValue,
  VStack,
  HStack
} from '@chakra-ui/react';
import UpgradeStandard from '../buttons/UpgradeStandard';
import UpgradePremium from '../buttons/UpgradePremium';
import { useHandleUpgrade } from '../../hooks/useHandleUpgrade';

const PricingSectionModal = () => {
  const { handleUpgrade } = useHandleUpgrade();
  const isMobile = useBreakpointValue({ base: true, md: false });

  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const plans = [
    {
      name: 'Básico',
      price: 'R$97/mês',
      description: 'Para indivíduos e pequenos negócios.',
      color: '#ff9e2c',
      features: [
        '2 usuários',
        '2.000 chats/mês',
        { label: 'Chats extras: R$10 por 500' },
        "Marca d'agua removida",
        'Upload de arquivos',
        'Criar pastas',
        'Suporte prioritário',
      ],
      button: <UpgradeStandard handleUpgrade={handleUpgrade} />,
    },
    {
      name: 'Premium',
      price: 'R$297/mês',
      description: 'Para agências e startups em crescimento.',
      color: '#2575fc',
      popular: true,
      features: [
        'Tudo no Básico, mais:',
        '5 usuários',
        '10.000 chats/mês',
        { label: 'Chats extras: Consulte faixas' },
        'Integração com WhatsApp',
        'Domínios personalizados',
        'Análises avançadas',
      ],
      button: <UpgradePremium handleUpgrade={handleUpgrade} />,
    },
  ];

  const renderPlan = (plan: any) => (
    <Box
      key={plan.name}
      borderWidth="1px"
      borderColor={plan.popular ? plan.color : borderColor}
      borderRadius="xl"
      p={{ base: 4, md: 6 }}
      position="relative"
      bg={useColorModeValue('white', 'gray.800')}
      _hover={{
        boxShadow: 'md',
        transform: 'translateY(-2px)',
        transition: 'all 0.2s ease-in-out'
      }}
      transition="all 0.2s ease-in-out"
    >
      {plan.popular && (
        <Badge
          position="absolute"
          top="-3"
          right={{ base: "2", md: "4" }}
          color="white"
          bg={plan.color}
          px={3}
          py={1}
          borderRadius="lg"
          fontSize="xs"
          fontWeight="medium"
        >
          Mais popular
        </Badge>
      )}

      <Heading fontSize={{ base: "md", md: "lg" }} mb={1}>
        Upgrade para{' '}
        <Box as="span" color={plan.color}>
          {plan.name}
        </Box>
      </Heading>
      <Text fontSize="sm" color="gray.600" mb={4}>
        {plan.description}
      </Text>
      <HStack spacing={1} mb={1} alignItems="baseline">
        <Text fontSize={{ base: "2xl", md: "3xl" }} fontWeight="bold">
          {plan.price}
        </Text>
        <Text fontSize="sm" color="gray.500">
          /mês
        </Text>
      </HStack>

      <VStack spacing={2} mb={6} fontSize="sm" color="gray.700" align="start">
        {plan.features.map((feature: any, idx: number) =>
          typeof feature === 'string' ? (
            <Text key={idx}>✓ {feature}</Text>
          ) : (
            <Text key={idx} fontSize="xs" color="gray.500" pl={4}>
              {feature.label}
            </Text>
          )
        )}
      </VStack>

      <Box mt="auto">{plan.button}</Box>
    </Box>
  );

  return (
    <SimpleGrid
      columns={{ base: 1, md: 2 }}
      spacing={{ base: 4, md: 6 }}
      width="100%"
    >
      {plans.map(renderPlan)}
    </SimpleGrid>
  );
};

export default PricingSectionModal;
