import { BsTextParagraph } from 'react-icons/bs'
import InputNode, { exportBaseInputNodeData } from './InputNode'
import { renderGenericInputNode } from './InputNode';

interface TextInputNodeProps {
  data: {
    value: string
    name?: string
    onChange: (field: string, value: string) => void
    onNameChange?: (name: string) => void
  }
  selected: boolean
}

const TextInputNode = ({ data, selected }: TextInputNodeProps) => {
  return (
    <InputNode
      icon={BsTextParagraph}
      label="Text Input"
      selected={selected}
      placeholder="Digite seu texto aqui..."
      value={data.value}
      name={data.name}
      onChange={(value) => data.onChange('value', value)}
      onNameChange={(name) => data.onNameChange && data.onNameChange(name)}
    />
  )
}

export function renderTextInputNode(props: any) {
  // Text input can have various validations (min length, max length, etc.)
  return renderGenericInputNode({
    ...props,
    inputType: "text",
    placeholder: "Type your answer..."
  });
}

export function exportTextInputNode(node: any) {
  return {
    type: 'input_text', // or "input_text" if you prefer
    content: {
      ...exportBaseInputNodeData(node),
      prompt: node.data?.value || '',
    },
  }
}

export default TextInputNode
