import { useState, useRef } from 'react';
import {
  Button,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
  useToast,
  Box,
  Flex,
  Text,
  Divider,
  Icon,
  Badge,
  VStack,
  HStack,
} from '@chakra-ui/react';
import { cancelSubscription } from '../../services/subscriptionService';
import { FiAlertTriangle, FiCalendar, FiCreditCard, FiXCircle, FiCheckCircle } from 'react-icons/fi';

const CancelSubscriptionButton = ({ onSuccess }: { onSuccess?: () => void }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const cancelRef = useRef(null);

  const handleCancel = async () => {
    setIsLoading(true);
    try {
      const result = await cancelSubscription();
      setIsLoading(false);
      onClose();

      toast({
        title: 'Assinatura cancelada',
        description: result.message,
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top',
        variant: 'solid',
      });

      // Atualize os dados no componente pai (se necessário)
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      setIsLoading(false);
      toast({
        title: 'Erro',
        description: error instanceof Error ? error.message : 'Ocorreu um erro ao cancelar sua assinatura',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top',
        variant: 'solid',
      });
    }
  };

  return (
    <>
      <Button
        colorScheme="red"
        variant="outline"
        size="sm"
        onClick={onOpen}
        mt={4}
        w="full"
        leftIcon={<FiXCircle />}
        _hover={{
          bg: 'red.50',
          borderColor: 'red.500',
        }}
        fontWeight="medium"
      >
        Cancelar minha assinatura
      </Button>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        motionPreset="slideInBottom"
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent
            mx={4}
            borderRadius="xl"
            boxShadow="2xl"
          >
            <Box position="relative" overflow="hidden">
              <Box
                position="absolute"
                top={0}
                left={0}
                right={0}
                h="8px"
                bgGradient="linear(to-r, red.400, red.600)"
              />

              <AlertDialogHeader
                fontSize="xl"
                fontWeight="bold"
                pt={8}
                pb={2}
                display="flex"
                alignItems="center"
              >
                <Icon as={FiAlertTriangle} w={6} h={6} color="red.500" mr={2} />
                <Text>Cancelar assinatura</Text>
              </AlertDialogHeader>

              <Divider />

              <AlertDialogBody py={6}>
                <VStack spacing={6} align="stretch">
                  <Box bg="red.50" p={4} borderRadius="md" borderLeft="4px solid" borderLeftColor="red.500">
                    <Text fontWeight="medium" color="gray.700">
                      Tem certeza que deseja cancelar sua assinatura Premium?
                    </Text>
                  </Box>

                  <Box>
                    <Text color="gray.600" fontSize="sm" mb={3}>
                      Ao cancelar sua assinatura:
                    </Text>

                    <VStack spacing={3} align="stretch">
                      <HStack spacing={3}>
                        <Icon as={FiCheckCircle} color="green.500" />
                        <Text fontSize="sm">
                          Você continuará tendo acesso ao seu plano atual até o final do período de cobrança
                        </Text>
                      </HStack>

                      <HStack spacing={3}>
                        <Icon as={FiCalendar} color="blue.500" />
                        <Text fontSize="sm">
                          Sem cobranças adicionais no próximo ciclo
                        </Text>
                      </HStack>

                      <HStack spacing={3}>
                        <Icon as={FiCreditCard} color="orange.500" />
                        <Text fontSize="sm">
                          Seu plano será revertido para a versão gratuita após o período atual
                        </Text>
                      </HStack>
                    </VStack>
                  </Box>

                  <Badge colorScheme="red" alignSelf="start" borderRadius="full" px={3} py={1}>
                    Esta ação não pode ser desfeita automaticamente
                  </Badge>
                </VStack>
              </AlertDialogBody>

              <AlertDialogFooter pt={2} pb={6} gap={3}>
                <Button
                  ref={cancelRef}
                  onClick={onClose}
                  size="md"
                  fontWeight="medium"
                  variant="outline"
                  px={6}
                >
                  Voltar
                </Button>
                <Button
                  colorScheme="red"
                  onClick={handleCancel}
                  isLoading={isLoading}
                  loadingText="Processando"
                  size="md"
                  fontWeight="medium"
                  leftIcon={<FiXCircle />}
                  px={6}
                  _hover={{
                    bgColor: 'red.600'
                  }}
                >
                  Confirmar cancelamento
                </Button>
              </AlertDialogFooter>
            </Box>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default CancelSubscriptionButton;
