import { BsTextParagraph } from 'react-icons/bs'
import InputNode, { exportBaseInputNodeData } from './InputNode'
import { renderGenericInputNode } from './InputNode';
import { Box, Text } from '@chakra-ui/react';

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
  const { node } = props;

  // When being used to render the node in the conversation, only show the prompt
  if (!props.setInputValue || !props.handleInputSubmit) {
    return (
      <Box>
        <Text>{node?.content?.prompt || ''}</Text>
      </Box>
    );
  }

  // Otherwise, use the generic input renderer for the input fields
  return renderGenericInputNode({
    ...props,
    inputType: "text",
    placeholder: "Digite sua resposta..."
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
