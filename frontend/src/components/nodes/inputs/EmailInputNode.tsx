import { MdOutlineEmail } from 'react-icons/md'
import InputNode from './InputNode'
import { renderGenericInputNode } from './InputNode';
import { exportBaseInputNodeData } from './InputNode';
import { Box, Text } from '@chakra-ui/react';

interface EmailInputNodeProps {
  data: {
    prompt: string  // changed from "value" to "prompt"
    name?: string
    onChange: (field: string, value: string) => void
    onNameChange?: (name: string) => void
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
      name={data.name}
      onChange={(value) => data.onChange('prompt', value)}
      onNameChange={(name) => data.onNameChange && data.onNameChange(name)}
    />
  )
}

export function renderEmailInputNode(props: any) {
  const { node } = props;

  // When being used to render the node in the conversation, only show the prompt
  if (!props.setInputValue || !props.handleInputSubmit) {
    return (
      <Box>
        <Text>{node?.content?.prompt || ''}</Text>
      </Box>
    );
  }

  // Make sure we have validation in the node
  const emailProps = { ...props };
  if (!emailProps.node?.content?.validation) {
    emailProps.node = {
      ...emailProps.node,
      content: {
        ...emailProps.node?.content,
        validation: {
          pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
          message: 'Por favor, digite um email válido'
        }
      }
    };
  }

  // Email validation is already in the node content from exportEmailInputNode
  return renderGenericInputNode({
    ...emailProps,
    inputType: "email",
    placeholder: "Digite seu email..."
  });
}


// Export function for the chat UI.
export function exportEmailInputNode(node: any) {
  return {
    type: 'input_email',
    content: {
      ...exportBaseInputNodeData(node),
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
