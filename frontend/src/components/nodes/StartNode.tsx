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
      <Handle type="source" position={Position.Bottom} />
    </Box>
  )
})

StartNode.displayName = 'StartNode'

export default StartNode 