import { Box, Button, HStack, IconButton, Image, Input, VStack, useColorModeValue, Text, SimpleGrid } from '@chakra-ui/react'
import { HiOutlinePhotograph } from 'react-icons/hi'
import { BsPlus, BsTrash } from 'react-icons/bs'
import BaseNode from '../BaseNode'
import { Handle, Position } from 'reactflow'
import { exportBaseInputNodeData } from './InputNode';

interface PicChoice {
  imageUrl: string
  label: string
}

interface PicChoiceInputNodeProps {
  data: {
    prompt: string  // Prompt for the user
    choices: PicChoice[]
    name?: string
    onChange: (field: string, value: any) => void
    onNameChange?: (name: string) => void
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
    <BaseNode icon={HiOutlinePhotograph} label="Picture Choice" selected={selected} name={data.name} onNameChange={(name) => data.onNameChange && data.onNameChange(name)}>
      <Box p={2}>
        <VStack spacing={4} align="stretch">
          {/* Prompt input */}
          <Input
            placeholder="Digite a pergunta para a escolha de imagem..."
            size="sm"
            value={data.prompt}
            onChange={(e) => data.onChange('prompt', e.target.value)}
            bg={inputBg}
            borderColor={borderColor}
          />

          {/* Picture choice options */}
          {data.choices.map((choice, index) => (
            <Box key={index} borderWidth={1} borderColor={borderColor} borderRadius="md" p={3} position="relative">
              <VStack spacing={3} align="stretch">
                {/* Left-side delete button */}
                <HStack position="absolute" top="0" left="0" spacing={2} zIndex={1}>
                  <IconButton
                    aria-label="Remover opção"
                    icon={<BsTrash />}
                    size="sm"
                    variant="ghost"
                    colorScheme="red"
                    onClick={() => removeChoice(index)}
                  />
                </HStack>

                {/* Image URL input */}
                <Input
                  value={choice.imageUrl}
                  onChange={(e) => updateChoice(index, 'imageUrl', e.target.value)}
                  placeholder="URL da imagem..."
                  size="sm"
                  bg={inputBg}
                  borderColor={borderColor}
                />

                {/* Display image if the URL is present */}
                {choice.imageUrl && (
                  <Image
                    src={choice.imageUrl}
                    alt={choice.label}
                    maxH="100px"
                    objectFit="contain"
                    borderRadius="md"
                  />
                )}

                {/* Label input */}
                <Input
                  value={choice.label}
                  onChange={(e) => updateChoice(index, 'label', e.target.value)}
                  placeholder="Legenda da imagem..."
                  size="sm"
                  bg={inputBg}
                  borderColor={borderColor}
                />

                {/* Right-side handle for connections */}
                <Handle
                  type="source"
                  position={Position.Right}
                  id={`button-${index}`}  // Unique handle for each button choice
                  style={{
                    width: 10,
                    height: 10,
                    background: '#555',
                    top: '50%',
                    right: -5,
                  }}
                />
              </VStack>
            </Box>
          ))}

          {/* Button to add new choice */}
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

// Export function for the chat UI.
export function exportPicChoiceInputNode(node: any) {
  return {
    type: 'input_pic_choice',  // This is how the chat UI will know it's a picture choice input
    content: {
      ...exportBaseInputNodeData(node),
      prompt: node.data?.prompt || '',
      choices: (node.data?.choices || []).map((choice: PicChoice) => ({
        label: choice.label,
        imageUrl: choice.imageUrl,
        next: null,  // "next" will be set based on the connections/edges
      })),
    },
  }
}

export function renderPicChoiceInputNode(props: any) {
  const { node, handleChoiceSelect } = props;

  // When used in conversation (without the input handlers), just render the prompt
  if (!props.handleChoiceSelect || !node?.content?.choices) {
    return (
      <Box>
        <Text>{node?.content?.prompt || ''}</Text>
      </Box>
    );
  }

  // For input field rendering, show the image choices
  const choices = node?.content?.choices || [];
  const columns = node?.content?.columns || 2; // Default to 2 columns

  return (
    <VStack spacing={3} align="stretch">
      <SimpleGrid columns={columns} spacing={3}>
        {choices.map((choice: any, idx: number) => (
          <Button
            key={idx}
            onClick={() => handleChoiceSelect(choice)}
            variant="outline"
            height="auto"
            padding={2}
            display="flex"
            flexDirection="column"
          >
            <Image
              src={choice.imageUrl}
              alt={choice.label}
              maxHeight="80px"
              objectFit="contain"
              marginBottom={2}
            />
            <Text>{choice.label}</Text>
          </Button>
        ))}
      </SimpleGrid>
    </VStack>
  );
}

PicChoiceInputNode.displayName = 'PicChoiceInputNode'

export default PicChoiceInputNode
