import { Box, FormControl, FormLabel, HStack, Input, Select, VStack, useColorModeValue } from '@chakra-ui/react'
import { MdPayment } from 'react-icons/md'
import BaseNode from '../BaseNode'

interface PaymentInputNodeProps {
  data: {
    amount: string
    currency: string
    description: string
    onChange: (field: string, value: string) => void
  }
  selected: boolean
}

const PaymentInputNode = ({ data, selected }: PaymentInputNodeProps) => {
  const inputBg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.600')

  return (
    <BaseNode icon={MdPayment} label="Payment Input" selected={selected}>
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

export default PaymentInputNode 