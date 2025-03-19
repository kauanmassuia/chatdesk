// AudioNode.tsx
import { memo } from 'react'
import { Input, VStack, Box, useColorModeValue } from '@chakra-ui/react'
import { FiHeadphones } from 'react-icons/fi'
import BaseNode from './BaseNode'

interface AudioNodeProps {
  data: {
    audioUrl: string
    title: string
    onChange: (field: string, value: string) => void
  }
  selected: boolean
}

const AudioNode = memo(({ data, selected }: AudioNodeProps) => {
  return (
    <BaseNode
      icon={FiHeadphones}
      label="Áudio"
      selected={selected}
    >
      <VStack spacing={3} align="stretch">
        <Input
          placeholder="Título do áudio"
          size="sm"
          value={data.title}
          onChange={(e) => data.onChange('title', e.target.value)}
          bg={useColorModeValue('gray.50', 'gray.800')}
        />
        <Input
          placeholder="URL do áudio"
          size="sm"
          value={data.audioUrl}
          onChange={(e) => data.onChange('audioUrl', e.target.value)}
          bg={useColorModeValue('gray.50', 'gray.800')}
        />
        {data.audioUrl && (
          <Box borderRadius="md" overflow="hidden" bg={useColorModeValue('gray.50', 'gray.800')} p={2}>
            <audio
              controls
              style={{ width: '100%' }}
              src={data.audioUrl}
              title={data.title}
            >
              Seu navegador não suporta o elemento de áudio.
            </audio>
          </Box>
        )}
      </VStack>
    </BaseNode>
  )
})

AudioNode.displayName = 'AudioNode'

// Exporter function for AudioNode:
export function exportAudioNode(node: any) {
  return {
    type: "audio",
    content: {
      audioUrl: node.data?.audioUrl || "",
      title: node.data?.title || "",
    },
  }
}

export default AudioNode
