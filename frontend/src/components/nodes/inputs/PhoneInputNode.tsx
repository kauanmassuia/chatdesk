import { BsTelephone } from 'react-icons/bs'
import InputNode from './InputNode'

interface PhoneInputNodeProps {
  data: {
    prompt: string  // Changed from "value" to "prompt" for the editor
    onChange: (field: string, value: string) => void
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
      onChange={(value) => data.onChange('prompt', value)}
    />
  )
}

// Export function for the chat UI.
export function exportPhoneInputNode(node: any) {
  return {
    type: 'input_phone',
    content: {
      prompt: node.data?.prompt || '', // Prompt for the phone number
      validation: {
        pattern: '\\([0-9]{2}\\) [0-9]{4,5}-[0-9]{4}',  // Regex for phone number validation
        message: 'Por favor, digite um telefone no formato (00) 00000-0000'
      }
    },
  }
}

PhoneInputNode.displayName = 'PhoneInputNode'

export default PhoneInputNode
