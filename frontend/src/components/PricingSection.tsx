import React, { useState } from 'react';
import {
  Box,
  Button,
  Heading,
  Stack,
  Text,
  SimpleGrid,
  Badge,
} from '@chakra-ui/react';
import { useLocation } from 'react-router-dom';
import LoginModal from './modal/LoginModal';
import RegisterModal from './modal/RegisterModal';
import UpgradeStandard from './buttons/UpgradeStandard';
import UpgradePremium from './buttons/UpgradePremium';
import { useHandleUpgrade } from '../hooks/useHandleUpgrade';

const PricingSection: React.FC = () => {
  const { handleUpgrade, showLoginModal, handleLoginSuccess } = useHandleUpgrade();
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const location = useLocation();

  const isDashboard = location.pathname === '/dashboard';

  const allPlans = [
    {
      name: 'Free',
      price: 'R$0/mês',
      features: [
        '✅ 1 usuário',
        '✅ 10 chats/mês',
        '✅ Criar pastas',
        '❌ Marca d’água',
        '❌ Upload de arquivos',
        '❌ Suporte prioritário',
      ],
      color: '#ff9e2c',
      button: <Button colorScheme="blue" w="full">Comece agora</Button>,
      description: 'Para quem quer começar sem custo.',
    },
    {
      name: 'Básico',
      price: 'R$97/mês',
      features: [
        '✅ 2 usuários',
        '✅ 2000 chats/mês',
        '✅ Criar pastas',
        '✅ Marca d’água',
        '✅ Upload de arquivos',
        '✅ Suporte prioritário',
      ],
      color: '#2575fc',
      badge: 'Mais popular',
      button: <UpgradeStandard handleUpgrade={handleUpgrade} />,
      description: 'Para indivíduos e pequenos negócios.',
    },
    {
      name: 'Profissional',
      price: 'R$297/mês',
      features: [
        '✅ 4 usuários',
        '✅ 20.000 chats/mês',
        '✅ Criar pastas',
        '✅ Marca d’água',
        '✅ Upload de arquivos',
        '✅ Suporte prioritário',
      ],
      color: '#ff9e2c',
      button: <UpgradePremium handleUpgrade={handleUpgrade} />,
      description: 'Para agências e startups em crescimento.',
    },
  ];

  // Filter out Free plan if on dashboard
  const plansToDisplay = isDashboard
    ? allPlans.filter((plan) => plan.name !== 'Free')
    : allPlans;

  const renderPlanCard = (plan: any) => (
    <Box
      key={plan.name}
      borderWidth={plan.badge ? '2px' : '1px'}
      borderColor={plan.badge ? plan.color : 'gray.200'}
      borderRadius="lg"
      boxShadow="md"
      transition="transform 0.3s"
      _hover={{ transform: 'scale(1.03)', boxShadow: 'xl' }}
      position="relative"
      bg="white"
      p={6}
    >
      {plan.badge && (
        <Badge
          position="absolute"
          top={0}
          right={0}
          color="white"
          bg={plan.color}
          borderRadius="0 0 0 6px"
          px={3}
          py={1}
          fontSize="xs"
        >
          {plan.badge}
        </Badge>
      )}
      <Heading fontSize="xl" color={plan.color}>
        {plan.name}
      </Heading>
      <Text mt={2} color="gray.600">
        {plan.description}
      </Text>
      <Text mt={4} fontSize="3xl" fontWeight="bold" color="gray.900">
        {plan.price}
      </Text>
      <Stack spacing={2} mt={6} color="gray.700">
        {plan.features.map((feature: string, idx: number) => (
          <Text key={idx}>{feature}</Text>
        ))}
      </Stack>
      <Box mt={6}>{plan.button}</Box>
    </Box>
  );

  return (
    <>
      <Box id="preco" py={8} bg="gray.50" width="100%">
        <Box maxW="full" px={{ base: 2, sm: 4, md: 6 }}>
          <Box textAlign="center" mb={12}>
            <Heading fontSize="3xl" fontWeight="extrabold" color="#2575fc">
              Escolha o plano ideal para você
            </Heading>
            <Text mt={4} fontSize="lg" color="gray.600">
              Veja nossos planos e comece a usar o VendFlow hoje!
            </Text>
          </Box>

          <SimpleGrid
            columns={{ base: 1, sm: 1, md: 2, lg: 3 }}
            spacing={6}
            width="100%"
            maxW="100%"
          >
            {plansToDisplay.map(renderPlanCard)}
          </SimpleGrid>
        </Box>
      </Box >

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => { }}
        onLoginSuccess={handleLoginSuccess}
        onRegisterClick={() => setShowRegisterModal(true)}
      />
      <RegisterModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onRegisterSuccess={() => {
          setShowRegisterModal(false);
          handleLoginSuccess();
        }}
      />
    </>
  );
};

export default PricingSection;
