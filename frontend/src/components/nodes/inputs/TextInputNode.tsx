import { BsTextParagraph } from 'react-icons/bs'
import InputNode from './InputNode'

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

export function exportTextInputNode(node: any) {
  return {
    type: 'text-input', // or "input_text" if you prefer
    content: {
      prompt: node.data?.value || '',
    },
  }
}

export default TextInputNode
