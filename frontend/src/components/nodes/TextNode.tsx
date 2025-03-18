import { memo } from 'react'
import { Textarea, useColorModeValue } from '@chakra-ui/react'
import { FiMessageSquare } from 'react-icons/fi'
import BaseNode from './BaseNode'

interface TextNodeProps {
  data: {
    text: string
    onChange: (text: string) => void
  }
  selected: boolean
}

const TextNode = memo(({ data, selected }: TextNodeProps) => {
  return (
    <BaseNode
      icon={FiMessageSquare}
      label="Mensagem de Texto"
      selected={selected}
    >
      <Textarea
        value={data.text}
        onChange={(e) => data.onChange(e.target.value)}
        placeholder="Digite sua mensagem aqui..."
        size="sm"
        resize="vertical"
        minH={20}
        bg={useColorModeValue('gray.50', 'gray.800')}
        border="1px"
        borderColor={useColorModeValue('gray.200', 'gray.600')}
        _focus={{
          borderColor: 'blue.500',
          boxShadow: 'none',
        }}
      />
    </BaseNode>
  )
})

TextNode.displayName = 'TextNode'

export default TextNode
