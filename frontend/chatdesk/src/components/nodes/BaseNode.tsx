import { Handle, Position } from 'reactflow'
import { Box, Text, useColorModeValue, IconButton, HStack } from '@chakra-ui/react'
import { memo, ReactNode, useMemo } from 'react'
import { IconType } from 'react-icons'
import { FiMoreHorizontal } from 'react-icons/fi'

interface BaseNodeProps {
  icon: IconType
  label: string
  selected: boolean
  children: ReactNode
}

const BaseNode = memo(({ icon: Icon, label, selected, children }: BaseNodeProps) => {
  const styles = useMemo(() => ({
    bgColor: useColorModeValue('white', 'gray.700'),
    borderColor: useColorModeValue(selected ? 'blue.500' : 'gray.200', selected ? 'blue.400' : 'gray.600'),
    headerBg: useColorModeValue('gray.50', 'gray.800'),
    handleColor: useColorModeValue('#CBD5E0', '#4A5568')
  }), [selected])

  return (
    <Box
      p={4}
      borderRadius="lg"
      bg={styles.bgColor}
      border="2px"
      borderColor={styles.borderColor}
      minW={300}
      maxW={400}
      shadow="sm"
      sx={{
        '&:active': {
          cursor: 'grabbing'
        }
      }}
    >
      <Handle 
        type="target" 
        position={Position.Top} 
        style={{ 
          background: styles.handleColor,
          width: '8px',
          height: '8px',
        }}
      />
      
      <HStack 
        mb={3} 
        className="drag"
        cursor="grab"
        userSelect="none"
        _active={{ cursor: 'grabbing' }}
        bg={styles.headerBg}
        p={2}
        borderRadius="md"
      >
        <Icon size={16} />
        <Text fontWeight="medium" fontSize="sm" flex={1}>
          {label}
        </Text>
        <IconButton
          aria-label="Mais opções"
          icon={<FiMoreHorizontal size={16} />}
          size="xs"
          variant="ghost"
          className="nodrag"
          p={1}
        />
      </HStack>

      <Box className="nodrag">
        {children}
      </Box>

      <Handle 
        type="source" 
        position={Position.Bottom}
        style={{ 
          background: styles.handleColor,
          width: '8px',
          height: '8px',
        }}
      />
    </Box>
  )
})

BaseNode.displayName = 'BaseNode'

export default BaseNode 