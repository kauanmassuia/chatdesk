import { Handle, Position } from 'reactflow'
import { Box, Text } from '@chakra-ui/react'
import { memo } from 'react'

const StartNode = memo(() => {
  return (
    <Box
      p={2}
      borderRadius="full"
      bg="white"
      border="2px"
      borderColor="gray.200"
      display="flex"
      alignItems="center"
      justifyContent="center"
      w="100px"
    >
      <Text fontSize="sm" fontWeight="medium">
        Start
      </Text>
      <Handle type="source" position={Position.Bottom}
      style={{
        width: 16,        // aumenta a largura
        height: 16,       // aumenta a altura
        background: '#353535', // muda a cor para azul (opcional)
        border: '2px solid white', // borda branca (opcional)
      }} />
    </Box>
  )
})

StartNode.displayName = 'StartNode'

// Exporter function for StartNode:
export function exportStartNode(node: any) {
  return {
    type: "start",
    content: {},  // No message; just a marker.
  }
}

export default StartNode
