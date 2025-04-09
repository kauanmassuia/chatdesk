import { TbWorldWww } from 'react-icons/tb'
import InputNode from './InputNode'
import { renderGenericInputNode } from './InputNode';
import { exportBaseInputNodeData } from './InputNode';
import { Box, Text } from '@chakra-ui/react';

interface WebsiteInputNodeProps {
  data: {
    prompt: string  // Prompt for the user
    name?: string
    onChange: (field: string, value: string) => void
    onNameChange?: (name: string) => void
  }
  selected: boolean
}

const WebsiteInputNode = ({ data, selected }: WebsiteInputNodeProps) => {
  return (
    <InputNode
      icon={TbWorldWww}
      label="Website Input"
      selected={selected}
      type="text"  // Type text in the editor so the user can type the prompt
      placeholder="Digite a pergunta para URL..."
      value={data.prompt}  // Use prompt instead of value for the question
      name={data.name}
      onChange={(value) => data.onChange('prompt', value)}  // Update the prompt value
      onNameChange={(name) => data.onNameChange && data.onNameChange(name)}
    />
  )
}

// Export function for the chat UI.
export function exportWebsiteInputNode(node: any) {
  return {
    type: 'input_website',  // Type for website input
    content: {
      ...exportBaseInputNodeData(node),
      prompt: node.data?.prompt || '',  // Include the prompt in the exported content
      validation: {
        pattern: 'https?://.+',  // Regex for URL validation
        message: 'Por favor, digite uma URL válida começando com http:// ou https://'
      }
    },
  }
}

export function renderWebsiteInputNode(props: any) {
  const { node, inputValue, setInputValue, handleKeyDown, handleInputSubmit } = props;

  // When being used to render the node in the conversation, only show the prompt
  if (!props.setInputValue || !props.handleInputSubmit) {
    return (
      <Box>
        <Text>{node?.content?.prompt || ''}</Text>
      </Box>
    );
  }

  // URL validation
  const urlProps = { ...props };
  const defaultPattern = "^(https?:\\/\\/)?(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)$";
  const defaultMessage = "Por favor, digite uma URL válida";

  if (!urlProps.node?.content?.validation) {
    urlProps.node = {
      ...urlProps.node,
      content: {
        ...urlProps.node?.content,
        validation: {
          pattern: defaultPattern,
          message: defaultMessage
        }
      }
    };
  }

  // Extract validation info
  const validationPattern = urlProps.node?.content?.validation?.pattern || defaultPattern;
  const validationMessage = urlProps.node?.content?.validation?.message || defaultMessage;

  // Calculate if input is invalid
  const isUrlInvalid = inputValue && inputValue.length > 0 ?
    !new RegExp(validationPattern).test(inputValue) : false;

  // Help format URLs as the user types
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!setInputValue) return;

    let value = e.target.value;

    // If user types a URL without http://, add it when they include a dot
    if (value.includes('.') && !value.startsWith('http://') && !value.startsWith('https://')) {
      // Only auto-add protocol if it looks like a domain (contains a dot and no spaces)
      if (!value.includes(' ') && /^[^.]+\.[^.]+/.test(value)) {
        // Don't modify if the user is still typing before the dot
        const parts = value.split('.');
        if (parts[0].length > 1) {
          // Only auto-correct after user has typed a full domain
          setInputValue(`https://${value}`);
          return;
        }
      }
    }

    setInputValue(value);
  };

  return (
    <div className="p-1">
      <div className="relative">
        <input
          type="url"
          value={inputValue || ''}
          onChange={handleUrlChange}
          onKeyDown={handleKeyDown}
          placeholder="Digite uma URL..."
          className={`w-full px-3 py-2 border ${isUrlInvalid ? 'border-red-500' : 'border-gray-300'} rounded-md`}
          autoFocus
        />
        {isUrlInvalid && (
          <div className="text-red-500 text-sm mt-1">
            {validationMessage}
          </div>
        )}
      </div>
      <button
        onClick={handleInputSubmit}
        disabled={isUrlInvalid}
        className={`mt-2 px-4 py-2 rounded-md w-full ${isUrlInvalid ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
      >
        Enviar
      </button>
    </div>
  );
}

WebsiteInputNode.displayName = 'WebsiteInputNode'

export default WebsiteInputNode
