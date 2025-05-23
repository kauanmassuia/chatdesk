import { BsClock } from 'react-icons/bs'
import InputNode from './InputNode'
import { Box, Text, Spinner, VStack } from '@chakra-ui/react';
import { exportBaseInputNodeData } from './InputNode';

interface WaitInputNodeProps {
  data: {
    value: string  // The wait time in seconds
    name?: string
    onChange: (field: string, value: string) => void
    onNameChange?: (name: string) => void
  }
  selected: boolean
}

const WaitInputNode = ({ data, selected }: WaitInputNodeProps) => {
  return (
    <InputNode
      icon={BsClock}
      label="Wait Time (seconds)"
      selected={selected}
      type="number"  // Type number since we're specifying a time in seconds
      value={data.value}
      name={data.name}
      onChange={(value) => data.onChange('value', value)}  // Update the value (seconds)
      onNameChange={(name) => data.onNameChange && data.onNameChange(name)}
    />
  )
}

// Export function for the chat UI.
export function exportWaitInputNode(node: any) {
  return {
    type: 'input_wait',  // Type for wait node
    content: {
      ...exportBaseInputNodeData(node),
      waitTime: parseInt(node.data?.value || '0', 10),  // Convert to integer (seconds)
    },
  }
}

export function renderWaitInputNode(props: any) {
  const { node } = props;

  // Show a spinner and countdown if needed
  const waitTime = node?.content?.waitTime || 1;
  const waitMessage = node?.content?.message || "Por favor, aguarde...";

  return (
    <VStack spacing={3} align="center">
      <Box>
        <Text>{waitMessage}</Text>
      </Box>
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.200"
        color="blue.500"
        size="md"
      />
      {waitTime > 2 && (
        <Text fontSize="sm" color="gray.500">
          (Aguardando por {waitTime} segundos)
        </Text>
      )}
    </VStack>
  );
}

WaitInputNode.displayName = 'WaitInputNode'

export default WaitInputNode
