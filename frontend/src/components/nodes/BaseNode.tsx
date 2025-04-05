import { Handle, Position } from 'reactflow'
import { Box, Text, useColorModeValue, IconButton, HStack, Input, Flex } from '@chakra-ui/react'
import { memo, ReactNode, useMemo, useState, useRef, KeyboardEvent } from 'react'
import { IconType } from 'react-icons'
import { FiMoreHorizontal } from 'react-icons/fi'

interface BaseNodeProps {
  icon: IconType
  label: string
  selected: boolean
  children: ReactNode
  name?: string
  onNameChange?: (name: string) => void
}

const BaseNode = memo(({ icon: Icon, label, selected, children, name, onNameChange }: BaseNodeProps) => {
  // Call hooks at the top level
  const bgColor = useColorModeValue('white', 'gray.700')
  const borderColor = useColorModeValue(selected ? 'blue.500' : 'gray.200', selected ? 'blue.400' : 'gray.600')
  const headerBg = useColorModeValue('gray.50', 'gray.800')
  const handleColor = useColorModeValue('#CBD5E0', '#4A5568')
  const [isEditing, setIsEditing] = useState(false)
  const [nodeName, setNodeName] = useState(name || label)
  const inputRef = useRef<HTMLInputElement>(null)

  // Combine values using useMemo if needed
  const styles = useMemo(() => ({
    bgColor,
    borderColor,
    headerBg,
    handleColor,
  }), [bgColor, borderColor, headerBg, handleColor])

  const handleNameClick = () => {
    setIsEditing(true)
    setTimeout(() => {
      inputRef.current?.focus()
      inputRef.current?.select()
    }, 0)
  }

  const handleNameChange = () => {
    if (onNameChange && nodeName.trim()) {
      onNameChange(nodeName)
    }
    setIsEditing(false)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleNameChange()
    } else if (e.key === 'Escape') {
      setNodeName(name || label)
      setIsEditing(false)
    }
  }

  return (
    <Box
      p={4}
      borderRadius="lg"
      className="drag"
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
        <Flex flex={1} className={isEditing ? "nodrag" : ""}>
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
              placeholder={label}
            />
          ) : (
            <Text
              fontWeight="medium"
              fontSize="sm"
              onClick={handleNameClick}
              className="nodrag"
              cursor="text"
              _hover={{ textDecoration: "underline" }}
            >
              {nodeName || label}
            </Text>
          )}
        </Flex>
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
