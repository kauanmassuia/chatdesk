import { Handle, Position } from 'reactflow'
import { Box, Text, Flex } from '@chakra-ui/react'
import { memo } from 'react'

const StartNode = memo(() => {
  return (
    <Box
      p={4}
      borderRadius="lg"  // Borda mais arredondada
      bg="white"
      border="2px"
      borderColor="gray.200"
      boxShadow="lg"  // Adiciona sombra suave
      w="200px"
      h="auto"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      position="relative"
    >
      <Text fontSize="md" fontWeight="bold" color="gray.700">
        Start Node
      </Text>
      <Text fontSize="sm" fontWeight="medium" color="gray.500" mt={2}>
        Initialize Flow
      </Text>
      <Handle
        type="source"
        position={Position.Right}
        style={{
          width: 20,
          height: 20,
          background: '#4A90E2',  // Cor mais visível
          border: '2px solid white',
          borderRadius: '50%',
          position: 'absolute',
          right: -10,  // Ajuste a posição para ficar abaixo
        }}
      />
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

export function renderStartNode() {
  // Start node is typically not rendered
  return null;
}

export default StartNode
