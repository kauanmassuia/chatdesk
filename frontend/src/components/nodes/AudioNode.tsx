// AudioNode.tsx
import { memo } from 'react'
import { Input, Box, VStack, useColorModeValue, Text } from '@chakra-ui/react'
import { FiMusic } from 'react-icons/fi'
import BaseNode from './BaseNode'

interface AudioNodeProps {
  data: {
    audioUrl: string
    title?: string
    name?: string
    onChange: (field: string, value: string) => void
    onNameChange?: (name: string) => void
  }
  selected: boolean
}

const AudioNode = memo(({ data, selected }: AudioNodeProps) => {
  return (
    <BaseNode
      icon={FiMusic}
      label="Áudio"
      name={data.name}
      onNameChange={(name) => data.onNameChange && data.onNameChange(name)}
      selected={selected}
    >
      <VStack spacing={3} align="stretch">
        <Input
          placeholder="Título do áudio"
          size="sm"
          value={data.title || ''}
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
          <Box borderRadius="md" overflow="hidden" bg={useColorModeValue('gray.100', 'gray.700')} p={2}>
            <audio
              style={{ width: '100%' }}
              controls
              src={data.audioUrl}
            />
          </Box>
        )}
      </VStack>
    </BaseNode>
  )
})

// Exporter function for AudioNode:
export function exportAudioNode(node: any) {
  return {
    type: 'audio',
    content: {
      audioUrl: node.data?.audioUrl || '',
      title: node.data?.title || '',
      name: node.data?.name || '',
    },
  }
}

export function renderAudioNode(node: any) {
  return (
    <Box>
      <audio
        controls
        src={node.content.audioUrl}
        style={{ width: "100%" }}
      />
    </Box>
  );
}

AudioNode.displayName = 'AudioNode'

export default AudioNode
