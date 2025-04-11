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
  inputValue = '',
  setInputValue,
  handleKeyDown,
  handleInputSubmit,
  inputType = "text",
  placeholder = "Digite sua resposta...",
  isInvalid = false,
  validationError,
}: RenderInputNodeProps) {
  // Extract validation patterns from node content if available
  const validationPattern = node?.content?.validation?.pattern || null;
  const validationMessage = node?.content?.validation?.message || "Por favor, digite um valor válido";

  // Check if this input has already been answered (if it has an answer node in the conversation)
  const isAnswered = node?.content?.answered === true;

  // Check if the current input is valid - adding a null check for inputValue
  const isInputInvalid = validationPattern && inputValue && inputValue.length > 0 ?
    !new RegExp(validationPattern).test(inputValue) : isInvalid;

  // Only show the prompt since the node is just a prompt message from the bot
  if (isAnswered) {
    return (
      <Box>
        <Text>{node?.content?.prompt || ''}</Text>
      </Box>
    );
  }

  // For rendering the input field (used by the InputField component)
  return (
    <div className="p-1">
      <div className="relative">
        <input
          type={inputType}
          value={inputValue || ''}
          onChange={(e) => setInputValue && setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`w-full px-3 py-2 border ${isInputInvalid && inputValue ? 'border-red-500' : 'border-gray-300'} rounded-md`}
          autoFocus
        />
        {isInputInvalid && inputValue && (
          <div className="text-red-500 text-sm mt-1">
            {validationMessage}
          </div>
        )}
      </div>
      <button
        onClick={handleInputSubmit}
        disabled={isInputInvalid && !!(inputValue || '')}
        className={`mt-2 px-4 py-2 rounded-md w-full ${isInputInvalid && inputValue ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
      >
        Enviar
      </button>
    </div>
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
