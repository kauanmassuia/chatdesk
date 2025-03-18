import { memo } from 'react'
import { Input, VStack, Image, useColorModeValue } from '@chakra-ui/react'
import { FiImage } from 'react-icons/fi'
import BaseNode from './BaseNode'

interface ImageNodeProps {
  data: {
    imageUrl: string
    alt: string
    onChange: (field: string, value: string) => void
  }
  selected: boolean
}

const ImageNode = memo(({ data, selected }: ImageNodeProps) => {
  return (
    <BaseNode
      icon={FiImage}
      label="Imagem"
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
          <Image
            src={data.imageUrl}
            alt={data.alt}
            maxH="200px"
            objectFit="contain"
            borderRadius="md"
          />
        )}
      </VStack>
    </BaseNode>
  )
})

export function exportImageNode(node: any) {
  return {
    type: 'image',
    content: {
      imageUrl: node.data?.imageUrl || '',
      alt: node.data?.alt || '',
    },
  }
}

ImageNode.displayName = 'ImageNode'

export default ImageNode
