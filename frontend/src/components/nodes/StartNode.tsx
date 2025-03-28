import { Handle, Position } from 'reactflow'
import { Box, Text } from '@chakra-ui/react'
import { memo } from 'react'

const StartNode = memo(() => {
  return (
    <Box
      p={4}  // Aumentei o padding para ficar mais próximo do tamanho dos outros blocos
      borderRadius="md"  // Deixei o borderRadius como 'md' para alinhar com o estilo dos outros nós
      bg="white"
      border="1px"
      borderColor="gray.200"
      minW={200}  // Defini um tamanho mínimo para ficar semelhante aos outros blocos
    >
      <Text fontSize="lg" fontWeight="bold" textAlign="center">  {/* Texto centralizado e com tamanho ajustado */}
        Start
      </Text>
      <Handle 
        type="source" 
        position={Position.Right}  // Mudei a posição da handle para a direita, como solicitado
        style={{
          width: 16,   // Aumentei a largura
          height: 16,  // Aumentei a altura
          background: '#353535', // Cor de fundo da handle
          border: '2px solid white', // Borda branca
        }} 
      />
    </Box>
  )
})

StartNode.displayName = 'StartNode'

// Exporter function for StartNode
export function exportStartNode(node: any) {
  return {
    type: "start",  // Tipo do nó
    content: {},    // Contente vazio, apenas um marcador
  }
}

export default StartNode
