import { MdOutlineNumbers } from 'react-icons/md'
import InputNode from './InputNode'
import { renderGenericInputNode } from './InputNode';

interface NumberInputNodeProps {
  data: {
    prompt: string  // Use prompt here instead of value
    onChange: (field: string, value: string) => void
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
      onChange={(value) => data.onChange('prompt', value)}
    />
  )
}

// Export function for the chat UI.
export function exportNumberInputNode(node: any) {
  return {
    type: 'input_number',
    content: {
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
    placeholder: "Enter a number..."
  });
}

NumberInputNode.displayName = 'NumberInputNode'

export default NumberInputNode
