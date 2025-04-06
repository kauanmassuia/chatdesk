import { BsCalendarDate } from 'react-icons/bs'
import InputNode from './InputNode'
import { Box, Text, Input, Button, VStack, HStack, FormControl } from '@chakra-ui/react';
import { exportBaseInputNodeData } from './InputNode';

interface DateInputNodeProps {
  data: {
    prompt: string // prompt text for what the user sees in the chat UI
    name?: string
    onChange: (field: string, value: string) => void
    onNameChange?: (name: string) => void
  }
  selected: boolean
}

const DateInputNode = ({ data, selected }: DateInputNodeProps) => {
  // In the editor, use a simple text input to let the user define the prompt.
  return (
    <InputNode
      icon={BsCalendarDate}
      label="Date Input"
      selected={selected}
      placeholder="Digite a pergunta para data..."
      value={data.prompt}
      name={data.name}
      onChange={(value) => data.onChange('prompt', value)}
      onNameChange={(name) => data.onNameChange && data.onNameChange(name)}
      type="text" // Use text input in the editor so you can type the prompt.
    />
  )
}

export function exportDateInputNode(node: any) {
  // When exporting, we want the chat UI to know that this is a date input.
  return {
    type: 'input_date',
    content: {
      ...exportBaseInputNodeData(node),
      prompt: node.data?.prompt || '',
    },
  }
}

export function renderDateInputNode({ node, inputValue, setInputValue, handleInputSubmit }: any) {
  // Date inputs need special handling for formatting and validation
  return (
    <VStack spacing={3} align="stretch">
      <Box>
        <Text>{node.content.prompt}</Text>
      </Box>
      <FormControl>
        <HStack>
          <Input
            type="date"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            flex="1"
          />
          <Button
            onClick={handleInputSubmit}
            colorScheme="blue"
            isDisabled={!inputValue}
          >
            Send
          </Button>
        </HStack>
      </FormControl>
    </VStack>
  );
}

DateInputNode.displayName = 'DateInputNode'

export default DateInputNode
