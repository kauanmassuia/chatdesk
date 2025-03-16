import { Handle, Position } from 'reactflow'
import { Box, Text, Textarea } from '@chakra-ui/react'
import { memo, useState } from 'react'

interface MessageNodeProps {
  data: {
    message: string
  }
}

const MessageNode = memo(({ data }: MessageNodeProps) => {
  const [message, setMessage] = useState(data.message)

  return (
    <Box
      p={4}
      borderRadius="md"
      bg="white"
      border="1px"
      borderColor="gray.200"
      minW={200}
    >
      <Handle type="target" position={Position.Top} />
      <Text mb={2} fontWeight="bold">
        Mensagem
      </Text>
      <Textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onMouseDown={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
        pointerEvents="auto"
        placeholder="Digite sua mensagem..."
        size="sm"
        resize="vertical"
        minH={20}
      />
      <Handle type="source" position={Position.Bottom} />
    </Box>
  )
})

MessageNode.displayName = 'MessageNode'

export default MessageNode
