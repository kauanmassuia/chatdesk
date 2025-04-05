import { BsClock } from 'react-icons/bs'
import InputNode from './InputNode'
import { Box, Text, Spinner, VStack } from '@chakra-ui/react';

interface WaitInputNodeProps {
  data: {
    value: string  // The wait time in seconds
    onChange: (field: string, value: string) => void
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
      onChange={(value) => data.onChange('value', value)}  // Update the value (seconds)
    />
  )
}

// Export function for the chat UI.
export function exportWaitInputNode(node: any) {
  return {
    type: 'input_wait',  // Type for wait node
    content: {
      waitTime: parseInt(node.data?.value || '0', 10),  // Convert to integer (seconds)
    },
  }
}

export function renderWaitInputNode({ node }: any) {
  // Show a spinner and countdown if needed
  const waitTime = node.content?.waitTime || 1;
  const waitMessage = node.content?.message || "Please wait...";

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
          (Waiting for {waitTime} seconds)
        </Text>
      )}
    </VStack>
  );
}

WaitInputNode.displayName = 'WaitInputNode'

export default WaitInputNode
