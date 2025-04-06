import { BsTelephone } from 'react-icons/bs'
import InputNode from './InputNode'
import { renderGenericInputNode } from './InputNode';
import { exportBaseInputNodeData } from './InputNode';

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
  // Phone inputs often have specific format requirements
  // If validation isn't already defined in the node, we'll add a default one
  const phoneProps = { ...props };

  if (!phoneProps.node.content.validation) {
    phoneProps.node.content.validation = {
      pattern: "^[0-9\\+\\-\\s\\(\\)]{8,20}$",
      message: "Please enter a valid phone number"
    };
  }

  return renderGenericInputNode({
    ...phoneProps,
    inputType: "tel",
    placeholder: "Enter your phone number..."
  });
}

PhoneInputNode.displayName = 'PhoneInputNode'

export default PhoneInputNode
