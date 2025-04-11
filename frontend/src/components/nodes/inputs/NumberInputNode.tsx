import { MdOutlineNumbers } from 'react-icons/md'
import InputNode from './InputNode'
import { renderGenericInputNode } from './InputNode';
import { exportBaseInputNodeData } from './InputNode';
import { Box, Text } from '@chakra-ui/react';

interface NumberInputNodeProps {
  data: {
    prompt: string  // Use prompt here instead of value
    name?: string
    onChange: (field: string, value: string) => void
    onNameChange?: (name: string) => void
  }
  selected: boolean
}

const NumberInputNode = ({ data, selected }: NumberInputNodeProps) => {
  return (
    <InputNode
      icon={MdOutlineNumbers}
      label="Number Input"
      selected={selected}
      // In the editor we want a text input so you can type the prompt.
      type="text"
      placeholder="Digite a pergunta para número..."
      value={data.prompt}
      name={data.name}
      onChange={(value) => data.onChange('prompt', value)}
      onNameChange={(name) => data.onNameChange && data.onNameChange(name)}
    />
  )
}

// Export function for the chat UI including min/max support
export function exportNumberInputNode(node: any) {
  return {
    type: 'input_number',
    content: {
      ...exportBaseInputNodeData(node),
      prompt: node.data?.prompt || '',
      validation: {
        pattern: '^[0-9]+$',
        message: 'Por favor, digite apenas números'
      },
      min: node.data?.min,
      max: node.data?.max
    },
  }
}

export function renderNumberInputNode(props: any) {
  const { node, inputValue, setInputValue, handleKeyDown, handleInputSubmit } = props;

  // When being used to render the node in the conversation, only show the prompt
  if (!props.setInputValue || !props.handleInputSubmit) {
    return (
      <Box>
        <Text>{node?.content?.prompt || ''}</Text>
      </Box>
    );
  }

  // Ensure we have validation for numbers
  const numberProps = { ...props };
  const defaultPattern = "^[0-9]+$";
  const defaultMessage = "Por favor, digite apenas números";

  if (!numberProps.node?.content?.validation) {
    numberProps.node = {
      ...numberProps.node,
      content: {
        ...numberProps.node?.content,
        validation: {
          pattern: defaultPattern,
          message: defaultMessage
        }
      }
    };
  }

  // Extract validation info
  const validationPattern = numberProps.node?.content?.validation?.pattern || defaultPattern;
  const validationMessage = numberProps.node?.content?.validation?.message || defaultMessage;
  const minValue = numberProps.node?.content?.min;
  const maxValue = numberProps.node?.content?.max;

  // Calculate if input is invalid
  let isNumberInvalid = false;
  let customMessage = validationMessage;

  if (inputValue && inputValue.length > 0) {
    // Check pattern
    if (!new RegExp(validationPattern).test(inputValue)) {
      isNumberInvalid = true;
    }
    // Check min/max constraints if applicable
    else {
      const numValue = parseFloat(inputValue);
      if (minValue !== undefined && numValue < minValue) {
        isNumberInvalid = true;
        customMessage = `Por favor, digite um número maior ou igual a ${minValue}`;
      }
      if (maxValue !== undefined && numValue > maxValue) {
        isNumberInvalid = true;
        customMessage = `Por favor, digite um número menor ou igual a ${maxValue}`;
      }
    }
  }

  // Only allow digits when typing
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!setInputValue) return;

    // Only allow digits and optional decimal point
    let value = e.target.value;
    if (value === '' || new RegExp('^[0-9]*\\.?[0-9]*$').test(value)) {
      setInputValue(value);
    }
  };

  return (
    <div className="p-1">
      <div className="relative">
        <input
          type="text" // Using text instead of number to have more control over validation
          inputMode="numeric"
          value={inputValue || ''}
          onChange={handleNumberChange}
          onKeyDown={handleKeyDown}
          placeholder="Digite um número..."
          className={`w-full px-3 py-2 border ${isNumberInvalid ? 'border-red-500' : 'border-gray-300'} rounded-md`}
          autoFocus
        />
        {isNumberInvalid && (
          <div className="text-red-500 text-sm mt-1">
            {customMessage}
          </div>
        )}
      </div>
      <button
        onClick={handleInputSubmit}
        disabled={isNumberInvalid}
        className={`mt-2 px-4 py-2 rounded-md w-full ${isNumberInvalid ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
      >
        Enviar
      </button>
    </div>
  );
}

NumberInputNode.displayName = 'NumberInputNode'

export default NumberInputNode
