import { MdOutlineEmail } from 'react-icons/md'
import InputNode from './InputNode'
import { renderGenericInputNode } from './InputNode';

interface EmailInputNodeProps {
  data: {
    prompt: string  // changed from "value" to "prompt"
    onChange: (field: string, value: string) => void
  }
  selected: boolean
}

const EmailInputNode = ({ data, selected }: EmailInputNodeProps) => {
  return (
    <InputNode
      icon={MdOutlineEmail}
      label="Email Input"
      selected={selected}
      type="text" // use a text input so you can type the prompt in the editor
      placeholder="Digite a pergunta para email..."
      value={data.prompt}
      onChange={(value) => data.onChange('prompt', value)}
    />
  )
}

export function renderEmailInputNode(props: any) {
  // Email validation is already in the node content from exportEmailInputNode
  // We don't need to add it here as it will be extracted by renderGenericInputNode
  return renderGenericInputNode({
    ...props,
    inputType: "email",
    placeholder: "Enter your email address..."
  });
}


// Export function for the chat UI.
export function exportEmailInputNode(node: any) {
  return {
    type: 'input_email',
    content: {
      prompt: node.data?.prompt || '',
      validation: {
        pattern: '[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$',
        message: 'Por favor, digite um email válido'
      }
    },
  }
}

EmailInputNode.displayName = 'EmailInputNode'
export default EmailInputNode
