import { memo } from 'react'
import { Input, Box, VStack, useColorModeValue, Image, Text } from '@chakra-ui/react'
import { FiImage } from 'react-icons/fi'
import BaseNode from './BaseNode'

interface ImageNodeProps {
  data: {
    imageUrl: string
    alt: string
    name?: string
    onChange: (field: string, value: string) => void
    onNameChange?: (name: string) => void
  }
  selected: boolean
}

const ImageNode = memo(({ data, selected }: ImageNodeProps) => {
  return (
    <BaseNode
      icon={FiImage}
      label="Imagem"
      name={data.name}
      onNameChange={(name) => data.onNameChange && data.onNameChange(name)}
      selected={selected}
    >
      <VStack spacing={3} align="stretch">
        <Input
          placeholder="URL da imagem"
          size="sm"
          value={data.imageUrl}
          onChange={(e) => data.onChange('imageUrl', e.target.value)}
          bg={useColorModeValue('gray.50', 'gray.800')}
        />
        <Input
          placeholder="Texto alternativo"
          size="sm"
          value={data.alt}
          onChange={(e) => data.onChange('alt', e.target.value)}
          bg={useColorModeValue('gray.50', 'gray.800')}
        />
        {data.imageUrl && (
          <Box borderRadius="md" overflow="hidden">
            <Image
              src={data.imageUrl}
              alt={data.alt}
              maxH="200px"
              objectFit="contain"
              fallback={<Box bg="gray.100" h="100px" w="100%" />}
            />
          </Box>
        )}
      </VStack>
    </BaseNode>
  )
})

export function renderImageNode(node: any) {
  return (
    <Box>
      <Image
        src={node.content.imageUrl}
        alt={node.content.alt || 'Imagem'}
        maxW="300px"
      />
    </Box>
  );
}

export function exportImageNode(node: any) {
  return {
    type: 'image',
    content: {
      imageUrl: node.data?.imageUrl || '',
      alt: node.data?.alt || '',
      name: node.data?.name || '',
    },
  };
}

ImageNode.displayName = 'ImageNode'

export default ImageNode
