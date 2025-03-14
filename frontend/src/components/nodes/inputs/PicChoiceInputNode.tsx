import { Box, Button, HStack, IconButton, Image, Input, VStack, useColorModeValue } from '@chakra-ui/react'
import { HiOutlinePhotograph } from 'react-icons/hi'
import { BsPlus, BsTrash } from 'react-icons/bs'
import BaseNode from '../BaseNode'

interface PicChoice {
  imageUrl: string
  label: string
}

interface PicChoiceInputNodeProps {
  data: {
    choices: PicChoice[]
    onChange: (field: string, value: PicChoice[]) => void
  }
  selected: boolean
}

const PicChoiceInputNode = ({ data, selected }: PicChoiceInputNodeProps) => {
  const addChoice = () => {
    data.onChange('choices', [...data.choices, { imageUrl: '', label: '' }])
  }

  const removeChoice = (index: number) => {
    const newChoices = [...data.choices]
    newChoices.splice(index, 1)
    data.onChange('choices', newChoices)
  }

  const updateChoice = (index: number, field: keyof PicChoice, value: string) => {
    const newChoices = [...data.choices]
    newChoices[index] = { ...newChoices[index], [field]: value }
    data.onChange('choices', newChoices)
  }

  const inputBg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.600')

  return (
    <BaseNode icon={HiOutlinePhotograph} label="Picture Choice" selected={selected}>
      <Box p={2}>
        <VStack spacing={4} align="stretch">
          {data.choices.map((choice, index) => (
            <Box key={index} borderWidth={1} borderColor={borderColor} borderRadius="md" p={3}>
              <VStack spacing={3}>
                <Input
                  value={choice.imageUrl}
                  onChange={(e) => updateChoice(index, 'imageUrl', e.target.value)}
                  placeholder="URL da imagem..."
                  size="sm"
                  bg={inputBg}
                  borderColor={borderColor}
                />
                {choice.imageUrl && (
                  <Image
                    src={choice.imageUrl}
                    alt={choice.label}
                    maxH="100px"
                    objectFit="contain"
                    borderRadius="md"
                  />
                )}
                <HStack>
                  <Input
                    value={choice.label}
                    onChange={(e) => updateChoice(index, 'label', e.target.value)}
                    placeholder="Legenda da imagem..."
                    size="sm"
                    bg={inputBg}
                    borderColor={borderColor}
                  />
                  <IconButton
                    aria-label="Remover opção"
                    icon={<BsTrash />}
                    size="sm"
                    variant="ghost"
                    colorScheme="red"
                    onClick={() => removeChoice(index)}
                  />
                </HStack>
              </VStack>
            </Box>
          ))}
          <Button
            leftIcon={<BsPlus />}
            size="sm"
            variant="ghost"
            onClick={addChoice}
            w="full"
          >
            Adicionar opção
          </Button>
        </VStack>
      </Box>
    </BaseNode>
  )
}

export default PicChoiceInputNode 