import { Handle, Position } from 'reactflow'
import { Box, Text, Flex, useColorModeValue, Input } from '@chakra-ui/react'
import { memo, useState, useRef, KeyboardEvent } from 'react'

interface StartNodeProps {
  data?: {
    name?: string
    onNameChange?: (name: string) => void
  }
  selected?: boolean
}

const StartNode = memo(({ data }: StartNodeProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [nodeName, setNodeName] = useState(data?.name || 'Start Node')
  const inputRef = useRef<HTMLInputElement>(null)
  const bgColor = useColorModeValue('white', 'gray.700')
  const borderColor = useColorModeValue('gray.200', 'gray.600')
  const textColor = useColorModeValue('gray.700', 'gray.200')
  const subtextColor = useColorModeValue('gray.500', 'gray.400')
  const handleColor = useColorModeValue('#4A90E2', '#4A90E2')

  const handleNameClick = () => {
    setIsEditing(true)
    setTimeout(() => {
      inputRef.current?.focus()
      inputRef.current?.select()
    }, 0)
  }

  const handleNameChange = () => {
    if (data?.onNameChange && nodeName.trim()) {
      data.onNameChange(nodeName)
    }
    setIsEditing(false)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleNameChange()
    } else if (e.key === 'Escape') {
      setNodeName(data?.name || 'Start Node')
      setIsEditing(false)
    }
  }

  return (
    <Box
      p={4}
      borderRadius="lg"  // Borda mais arredondada
      bg={bgColor}
      border="2px"
      borderColor={borderColor}
      boxShadow="lg"  // Adiciona sombra suave
      w="200px"
      h="auto"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      position="relative"
    >
      {isEditing ? (
        <Input
          ref={inputRef}
          size="sm"
          value={nodeName}
          onChange={(e) => setNodeName(e.target.value)}
          onBlur={handleNameChange}
          onKeyDown={handleKeyDown}
          className="nodrag"
          autoFocus
          textAlign="center"
          mb={2}
          placeholder="Nome do nó inicial"
        />
      ) : (
        <Text
          fontSize="md"
          fontWeight="bold"
          color={textColor}
          onClick={handleNameClick}
          className="nodrag"
          cursor="text"
          mb={2}
          _hover={{ textDecoration: "underline" }}
        >
          {nodeName}
        </Text>
      )}
      <Text fontSize="sm" fontWeight="medium" color={subtextColor} mt={2}>
        Initialize Flow
      </Text>
      <Handle
        type="source"
        position={Position.Right}
        style={{
          width: 20,
          height: 20,
          background: handleColor,  // Cor mais visível
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
    content: {
      name: node.data?.name || 'Start Node'
    },
  }
}

export function renderStartNode(node: any) {
  // Start node is typically not rendered in the chat interface
  return null;
}

export default StartNode
