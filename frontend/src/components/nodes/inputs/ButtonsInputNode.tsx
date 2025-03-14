import { Box, Button, HStack, IconButton, Input, VStack, useColorModeValue } from '@chakra-ui/react'
import { BsGrid, BsPlus, BsTrash } from 'react-icons/bs'
import BaseNode from '../BaseNode'

interface ButtonsInputNodeProps {
  data: {
    buttons: string[]
    onChange: (field: string, value: string[]) => void
  }
  selected: boolean
}

const ButtonsInputNode = ({ data, selected }: ButtonsInputNodeProps) => {
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

  const inputBg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.600')

  return (
    <BaseNode icon={BsGrid} label="Buttons Input" selected={selected}>
      <Box p={2}>
        <VStack spacing={3} align="stretch">
          {data.buttons.map((button, index) => (
            <HStack key={index}>
              <Input
                value={button}
                onChange={(e) => updateButton(index, e.target.value)}
                placeholder="Texto do botão..."
                size="sm"
                bg={inputBg}
                borderColor={borderColor}
              />
              <IconButton
                aria-label="Remover botão"
                icon={<BsTrash />}
                size="sm"
                variant="ghost"
                colorScheme="red"
                onClick={() => removeButton(index)}
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

export default ButtonsInputNode 