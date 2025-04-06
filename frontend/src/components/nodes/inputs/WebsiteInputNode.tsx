import { TbWorldWww } from 'react-icons/tb'
import InputNode from './InputNode'
import { renderGenericInputNode } from './InputNode';
import { exportBaseInputNodeData } from './InputNode';

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
  // URL validation
  const urlProps = { ...props };

  if (!urlProps.node.content.validation) {
    urlProps.node.content.validation = {
      pattern: "^(https?:\\/\\/)?(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)$",
      message: "Please enter a valid URL"
    };
  }

  return renderGenericInputNode({
    ...urlProps,
    inputType: "url",
    placeholder: "Digite uma URL..."
  });
}

WebsiteInputNode.displayName = 'WebsiteInputNode'

export default WebsiteInputNode
