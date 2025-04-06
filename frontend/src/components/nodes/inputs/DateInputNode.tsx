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
  // Show only the prompt text since the actual input will be rendered on the right side in ChatReader
  return (
    <Box>
      <Text>{node.content.prompt}</Text>
    </Box>
  );
}

// Helper to convert between ISO date format and Brazilian format (dd/mm/yyyy)
export function formatDateBrazilian(isoDate: string): string {
  if (!isoDate) return '';
  try {
    const [year, month, day] = isoDate.split('-');
    return `${day}/${month}/${year}`;
  } catch (e) {
    return isoDate;
  }
}

export function parseToIsoDate(brDate: string): string {
  if (!brDate) return '';
  try {
    const [day, month, year] = brDate.split('/');
    return `${year}-${month}-${day}`;
  } catch (e) {
    return brDate;
  }
}

DateInputNode.displayName = 'DateInputNode'

export default DateInputNode
