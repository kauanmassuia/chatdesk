import { BsTextParagraph } from 'react-icons/bs'
import InputNode from './InputNode'
import { renderGenericInputNode } from './InputNode';

interface TextInputNodeProps {
  data: {
    value: string
    onChange: (field: string, value: string) => void
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
      onChange={(value) => data.onChange('value', value)}
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
      prompt: node.data?.value || '',
    },
  }
}

export default TextInputNode
