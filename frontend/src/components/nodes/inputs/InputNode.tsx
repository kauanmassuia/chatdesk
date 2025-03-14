import { Box, FormControl, FormLabel, Input, useColorModeValue } from '@chakra-ui/react'
import BaseNode from '../BaseNode'
import { IconType } from 'react-icons'

interface InputNodeProps {
  icon: IconType
  label: string
  selected: boolean
  placeholder?: string
  type?: string
  value: string
  onChange: (value: string) => void
  validation?: {
    pattern?: string
    message?: string
  }
}

const InputNode = ({ 
  icon, 
  label, 
  selected, 
  placeholder, 
  type = 'text',
  value,
  onChange,
  validation
}: InputNodeProps) => {
  const inputBg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.600')

  return (
    <BaseNode icon={icon} label={label} selected={selected}>
      <Box p={2}>
        <FormControl>
          <FormLabel fontSize="sm" mb={2}>
            {label}
          </FormLabel>
          <Input
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            bg={inputBg}
            borderColor={borderColor}
            size="md"
            pattern={validation?.pattern}
            title={validation?.message}
          />
        </FormControl>
      </Box>
    </BaseNode>
  )
}

export default InputNode 