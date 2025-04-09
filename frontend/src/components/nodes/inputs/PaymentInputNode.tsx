import { Box, FormControl, FormLabel, HStack, Input, Select, VStack, useColorModeValue, Text, Button, Divider } from '@chakra-ui/react'
import { MdPayment } from 'react-icons/md'
import BaseNode from '../BaseNode'
import { exportBaseInputNodeData } from './InputNode'

interface PaymentInputNodeProps {
  data: {
    amount: string
    currency: string
    description: string
    name?: string
    onChange: (field: string, value: string) => void
    onNameChange?: (name: string) => void
  }
  selected: boolean
}

const PaymentInputNode = ({ data, selected }: PaymentInputNodeProps) => {
  const inputBg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.600')

  return (
    <BaseNode
      icon={MdPayment}
      label="Payment Input"
      selected={selected}
      name={data.name}
      onNameChange={(name) => data.onNameChange && data.onNameChange(name)}
    >
      <Box p={2}>
        <VStack spacing={3} align="stretch">
          <HStack>
            <FormControl flex={2}>
              <FormLabel fontSize="sm">Valor</FormLabel>
              <Input
                type="number"
                value={data.amount}
                onChange={(e) => data.onChange('amount', e.target.value)}
                placeholder="0.00"
                size="sm"
                bg={inputBg}
                borderColor={borderColor}
              />
            </FormControl>
            <FormControl flex={1}>
              <FormLabel fontSize="sm">Moeda</FormLabel>
              <Select
                value={data.currency}
                onChange={(e) => data.onChange('currency', e.target.value)}
                size="sm"
                bg={inputBg}
                borderColor={borderColor}
              >
                <option value="BRL">BRL</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </Select>
            </FormControl>
          </HStack>
          <FormControl>
            <FormLabel fontSize="sm">Descrição</FormLabel>
            <Input
              value={data.description}
              onChange={(e) => data.onChange('description', e.target.value)}
              placeholder="Descrição do pagamento..."
              size="sm"
              bg={inputBg}
              borderColor={borderColor}
            />
          </FormControl>
        </VStack>
      </Box>
    </BaseNode>
  )
}

export function renderPaymentInputNode(props: any) {
  const { node, handleChoiceSelect } = props;

  // When used in conversation (without the input handlers), just show the prompt
  if (!props.handleChoiceSelect) {
    return (
      <Box>
        <Text>{node?.content?.prompt || 'Pagamento Necessário'}</Text>
      </Box>
    );
  }

  // Otherwise show the full payment UI
  const amount = node?.content?.amount || 0;
  const currency = node?.content?.currency || 'BRL';
  const description = node?.content?.description || '';

  return (
    <VStack spacing={3} align="stretch" p={3} borderWidth="1px" borderRadius="md">
      <Box>
        <Text fontWeight="bold">{node?.content?.prompt || 'Pagamento Necessário'}</Text>
        {description && <Text fontSize="sm" color="gray.600" mt={1}>{description}</Text>}
      </Box>
      <Divider />
      <HStack justifyContent="space-between">
        <Text>Valor:</Text>
        <Text fontWeight="bold">{amount} {currency}</Text>
      </HStack>
      <Button
        onClick={() => handleChoiceSelect({ label: 'Pagamento concluído', next: node?.next })}
        colorScheme="green"
        size="md"
        mt={2}
      >
        Pagar {amount} {currency}
      </Button>
      <Text fontSize="xs" color="gray.500" textAlign="center">
        Pagamento seguro processado por nosso provedor de pagamentos
      </Text>
    </VStack>
  );
}

// Export function for the chat UI
export function exportPaymentInputNode(node: any) {
  return {
    type: 'input_payment',
    content: {
      ...exportBaseInputNodeData(node),
      prompt: node.data?.description || 'Payment Required',
      amount: node.data?.amount || '0',
      currency: node.data?.currency || 'USD',
      description: node.data?.description || '',
    },
  }
}

export default PaymentInputNode
