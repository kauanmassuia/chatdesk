import { Box, Button, HStack, IconButton, Input, VStack, useColorModeValue, FormControl, FormLabel } from '@chakra-ui/react'
import { Handle, Position } from 'reactflow'
import { BsGrid, BsPlus, BsTrash } from 'react-icons/bs'
import BaseNode from '../BaseNode'

interface ButtonsInputNodeData {
  buttons: string[]
  prompt?: string
  onChange: (field: string, value: any) => void
}

interface ButtonsInputNodeProps {
  data: ButtonsInputNodeData
  selected: boolean
}

const ButtonsInputNode = ({ data, selected }: ButtonsInputNodeProps) => {
  const inputBg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.600')

  const addButton = () => {
    data.onChange('buttons', [...data.buttons, ''])
  }

  const removeButton = (index: number) => {
    const newButtons = [...data.buttons]
    newButtons.splice(index, 1)
    data.onChange('buttons', newButtons)
  }

  const updateButton = (index: number, value: string) => {
    const newButtons = [...data.buttons]
    newButtons[index] = value
    data.onChange('buttons', newButtons)
  }

  return (
    <BaseNode icon={BsGrid} label="Buttons Input" selected={selected}>
      <Box p={2}>
        <VStack spacing={3} align="stretch">
          {/* Prompt input */}
          <FormControl>
            <FormLabel fontSize="sm" mb={1}>Prompt</FormLabel>
            <Input
              placeholder="Digite o prompt para o usuário..."
              size="sm"
              value={data.prompt || ''}
              onChange={(e) => data.onChange('prompt', e.target.value)}
              bg={inputBg}
              borderColor={borderColor}
            />
          </FormControl>

          {/* Button choices with individual connection handles */}
          {data.buttons.map((button, index) => (
            <HStack key={index} position="relative">
              <IconButton
                aria-label="Remover botão"
                icon={<BsTrash />}
                size="sm"
                variant="ghost"
                colorScheme="red"
                onClick={() => removeButton(index)}
              />
              <Input
                value={button}
                onChange={(e) => updateButton(index, e.target.value)}
                placeholder="Texto do botão..."
                size="sm"
                bg={inputBg}
                borderColor={borderColor}
              />
              {/* The handle for this specific button */}
              <Handle
                type="source"
                position={Position.Right}
                id={`button-${index}`}
                style={{
                  width: 10,
                  height: 10,
                  background: '#555',
                  top: '50%',
                  right: -5,
                }}
              />
            </HStack>
          ))}
          <Button
            leftIcon={<BsPlus />}
            size="sm"
            variant="ghost"
            onClick={addButton}
            w="full"
          >
            Adicionar botão
          </Button>
        </VStack>
      </Box>
    </BaseNode>
  )
}

export function exportButtonsInputNode(node: any) {
  return {
    type: 'input_buttons',
    content: {
      prompt: node.data?.prompt || '',
      choices: (node.data?.buttons || []).map((btn: string) => ({
        label: btn,
        next: null,
      })),
    },
  }
}

ButtonsInputNode.displayName = 'ButtonsInputNode'

export default ButtonsInputNode
