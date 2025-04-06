import { Box, FormControl, FormLabel, Input, Textarea, useColorModeValue, HStack, VStack, Text, Button, FormErrorMessage } from '@chakra-ui/react'
import BaseNode from '../BaseNode'
import { IconType } from 'react-icons'

interface InputNodeProps {
  icon: IconType
  label: string
  selected: boolean
  placeholder?: string
  type?: string
  value: string
  name?: string
  onChange: (value: string) => void
  onNameChange?: (name: string) => void
  multiline?: boolean  // New prop to support TextNode
  validation?: {
    pattern?: string
    message?: string
  }
}

interface RenderInputNodeProps {
  node: any;
  inputValue: string;
  setInputValue: (value: string) => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  handleInputSubmit: () => void;
  inputType?: string;
  placeholder?: string;
  isInvalid?: boolean;
  validationError?: string;
}

const InputNode = ({
  icon,
  label,
  selected,
  placeholder,
  type = 'text',
  value,
  name,
  onChange,
  onNameChange,
  multiline = false,  // Default to single-line input
  validation
}: InputNodeProps) => {
  const inputBg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.600')

  return (
    <BaseNode
      icon={icon}
      label={label}
      selected={selected}
      name={name}
      onNameChange={onNameChange}
    >
      <Box p={2}>
        <FormControl>
          <FormLabel fontSize="sm" mb={2}>
            {label}
          </FormLabel>
          {multiline ? (
            <Textarea
              placeholder={placeholder}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              bg={inputBg}
              borderColor={borderColor}
              size="sm"
              resize="vertical"
              minH={20}
            />
          ) : (
            <Input
              type={type}
              placeholder={placeholder}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              bg={inputBg}
              borderColor={borderColor}
              size="md"
              pattern={validation?.pattern}
              title={validation?.message}
            />
          )}
        </FormControl>
      </Box>
    </BaseNode>
  )
}

export function renderGenericInputNode({
  node,
  inputValue,
  setInputValue,
  handleKeyDown,
  handleInputSubmit,
  inputType = "text",
  placeholder = "Digite sua resposta...",
  isInvalid = false,
  validationError,
}: RenderInputNodeProps) {
  // Extract validation patterns from node content if available
  const validationPattern = node.content.validation?.pattern || null;
  const validationMessage = node.content.validation?.message || "Por favor, digite um valor válido";

  // Check if this input has already been answered (if it has an answer node in the conversation)
  const isAnswered = node.content.answered === true;

  // Check if the current input is valid
  const isInputInvalid = validationPattern ?
    !new RegExp(validationPattern).test(inputValue) && inputValue.length > 0 : false || isInvalid;

  // Only show the prompt since the node is just a prompt message from the bot
  if (isAnswered) {
  return (
      <Box>
        <Text>{node.content.prompt}</Text>
      </Box>
    );
  }

  // Show prompt only, input will be displayed on the right side
  return (
    <Box>
      <Text>{node.content.prompt}</Text>
    </Box>
  );
}

// Helper function to ensure every input node exports its name
export function exportBaseInputNodeData(node: any) {
  return {
    name: node.data?.name || '',
    // Some nodes use 'prompt' and others use 'value' - handle both cases
    prompt: node.data?.prompt || node.data?.value || '',
    validation: node.data?.validation || null,
  };
}

export default InputNode
