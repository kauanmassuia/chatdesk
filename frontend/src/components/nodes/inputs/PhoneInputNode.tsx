import { BsTelephone } from 'react-icons/bs'
import InputNode from './InputNode'
import { renderGenericInputNode } from './InputNode';
import { exportBaseInputNodeData } from './InputNode';
import { Box, Text } from '@chakra-ui/react';

interface PhoneInputNodeProps {
  data: {
    prompt: string  // Changed from "value" to "prompt" for the editor
    name?: string
    onChange: (field: string, value: string) => void
    onNameChange?: (name: string) => void
  }
  selected: boolean
}

const PhoneInputNode = ({ data, selected }: PhoneInputNodeProps) => {
  return (
    <InputNode
      icon={BsTelephone}
      label="Phone Input"
      selected={selected}
      type="text"  // In the editor, use a text input to type the prompt
      placeholder="Digite a pergunta para o número de telefone..."
      value={data.prompt}
      name={data.name}
      onChange={(value) => data.onChange('prompt', value)}
      onNameChange={(name) => data.onNameChange && data.onNameChange(name)}
    />
  )
}

// Export function for the chat UI.
export function exportPhoneInputNode(node: any) {
  return {
    type: 'input_phone',
    content: {
      ...exportBaseInputNodeData(node),
      prompt: node.data?.prompt || '', // Prompt for the phone number
      validation: {
        pattern: '\\([0-9]{2}\\) [0-9]{4,5}-[0-9]{4}',  // Regex for phone number validation
        message: 'Por favor, digite um telefone no formato (00) 00000-0000'
      }
    },
  }
}

export function renderPhoneInputNode(props: any) {
  const { node, inputValue, setInputValue, handleKeyDown, handleInputSubmit } = props;

  // When being used to render the node in the conversation, only show the prompt
  if (!props.setInputValue || !props.handleInputSubmit) {
    return (
      <Box>
        <Text>{node?.content?.prompt || ''}</Text>
      </Box>
    );
  }

  // Phone inputs often have specific format requirements
  // If validation isn't already defined in the node, we'll add a default one
  const phoneProps = { ...props };
  const defaultPattern = "^\\(?([0-9]{2})\\)?[-. ]?([0-9]{4,5})[-. ]?([0-9]{4})$";
  const defaultMessage = "Por favor, digite um telefone válido no formato (00) 00000-0000";

  if (!phoneProps.node?.content?.validation) {
    phoneProps.node = {
      ...phoneProps.node,
      content: {
        ...phoneProps.node?.content,
        validation: {
          pattern: defaultPattern,
          message: defaultMessage
        }
      }
    };
  }

  // Format phone number as user types
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!setInputValue) return;

    let value = e.target.value.replace(/\D/g, '');
    let formattedValue = '';

    // Apply formatting based on how many digits have been entered
    if (value.length === 0) {
      formattedValue = '';
    } else if (value.length <= 2) {
      formattedValue = `(${value}`;
    } else if (value.length <= 6) {
      formattedValue = `(${value.slice(0, 2)}) ${value.slice(2)}`;
    } else if (value.length <= 10) {
      formattedValue = `(${value.slice(0, 2)}) ${value.slice(2, 6)}-${value.slice(6)}`;
    } else {
      formattedValue = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7, 11)}`;
    }

    setInputValue(formattedValue);
  };

  // Custom phone input with formatting
  const validationPattern = phoneProps.node?.content?.validation?.pattern || defaultPattern;
  const validationMessage = phoneProps.node?.content?.validation?.message || defaultMessage;

  // Calculate if input is invalid
  const isPhoneInvalid = inputValue && inputValue.length > 0 ?
    !new RegExp(validationPattern).test(inputValue) : false;

  return (
    <div className="p-1">
      <div className="relative">
        <input
          type="tel"
          value={inputValue || ''}
          onChange={handlePhoneChange}
          onKeyDown={handleKeyDown}
          placeholder="(00) 00000-0000"
          className={`w-full px-3 py-2 border ${isPhoneInvalid ? 'border-red-500' : 'border-gray-300'} rounded-md`}
          maxLength={16}
          autoFocus
        />
        {isPhoneInvalid && (
          <div className="text-red-500 text-sm mt-1">
            {validationMessage}
          </div>
        )}
      </div>
      <button
        onClick={handleInputSubmit}
        disabled={isPhoneInvalid}
        className={`mt-2 px-4 py-2 rounded-md w-full ${isPhoneInvalid ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
      >
        Enviar
      </button>
    </div>
  );
}

PhoneInputNode.displayName = 'PhoneInputNode'

export default PhoneInputNode
