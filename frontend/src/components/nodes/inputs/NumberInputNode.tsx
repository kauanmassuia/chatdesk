import { MdOutlineNumbers } from 'react-icons/md'
import InputNode from './InputNode'
import { renderGenericInputNode } from './InputNode';
import { exportBaseInputNodeData } from './InputNode';

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

// Export function for the chat UI.
export function exportNumberInputNode(node: any) {
  return {
    type: 'input_number',
    content: {
      ...exportBaseInputNodeData(node),
      prompt: node.data?.prompt || '',
      validation: {
        pattern: '^[0-9]+$',
        message: 'Por favor, digite apenas números'
      }
    },
  }
}

export function renderNumberInputNode(props: any) {
  // Number inputs can have their own validation defined in the node
  // e.g., min/max values, number format, etc.
  return renderGenericInputNode({
    ...props,
    inputType: "number",
    placeholder: "Digite um número..."
  });
}

NumberInputNode.displayName = 'NumberInputNode'

export default NumberInputNode
