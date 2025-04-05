import { memo } from 'react'
import { Input, Select, Box, VStack, useColorModeValue, Text } from '@chakra-ui/react'
import { FiVideo } from 'react-icons/fi'
import BaseNode from './BaseNode'

interface VideoNodeProps {
  data: {
    videoUrl: string
    type: 'youtube' | 'vimeo' | 'direct'
    name?: string
    onChange: (field: string, value: string) => void
    onNameChange?: (name: string) => void
  }
  selected: boolean
}

const VideoNode = memo(({ data, selected }: VideoNodeProps) => {
  return (
    <BaseNode
      icon={FiVideo}
      label="Vídeo"
      name={data.name}
      onNameChange={(name) => data.onNameChange && data.onNameChange(name)}
      selected={selected}
    >
      <VStack spacing={3} align="stretch">
        <Select
          value={data.type}
          onChange={(e) => data.onChange('type', e.target.value)}
          size="sm"
          bg={useColorModeValue('gray.50', 'gray.800')}
        >
          <option value="youtube">YouTube</option>
          <option value="vimeo">Vimeo</option>
          <option value="direct">URL Direta</option>
        </Select>
        <Input
          placeholder="URL do vídeo"
          size="sm"
          value={data.videoUrl}
          onChange={(e) => data.onChange('videoUrl', e.target.value)}
          bg={useColorModeValue('gray.50', 'gray.800')}
        />
        {data.videoUrl && (
          <Box position="relative" paddingTop="56.25%" borderRadius="md" overflow="hidden">
            {data.type === 'youtube' && (
              <iframe
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  border: 0,
                }}
                src={`https://www.youtube.com/embed/${getYoutubeId(data.videoUrl)}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )}
            {data.type === 'vimeo' && (
              <iframe
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  border: 0,
                }}
                src={`https://player.vimeo.com/video/${getVimeoId(data.videoUrl)}`}
                allow="autoplay; fullscreen"
                allowFullScreen
              />
            )}
            {data.type === 'direct' && (
              <video
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                }}
                controls
                src={data.videoUrl}
              />
            )}
          </Box>
        )}
      </VStack>
    </BaseNode>
  )
})

function getYoutubeId(url: string): string {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
  const match = url.match(regExp)
  return match && match[2].length === 11 ? match[2] : ''
}

function getVimeoId(url: string): string {
  const regExp = /^.*(vimeo.com\/)([0-9]+).*/
  const match = url.match(regExp)
  return match ? match[2] : ''
}

function getYoutubeEmbedUrl(url: string): string {
  const match = url.match(/(?:v=|youtu\.be\/)([^&]+)/); // Regex to extract the video ID
  if (match && match[1]) {
    return `https://www.youtube.com/embed/${match[1]}`;
  }
  return url; // If it's not a YouTube URL, return the original URL.
}

export function renderVideoNode(node: any) {
  const embedUrl = getYoutubeEmbedUrl(node.content.videoUrl || node.content.url);
  return (
    <Box>
      <iframe
        src={embedUrl}
        title="video"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        style={{ width: "300px", height: "200px" }}
      />
    </Box>
  );
}

export function exportVideoNode(node: any) {
  return {
    type: 'video',
    content: {
      videoUrl: node.data?.videoUrl || '',
      mediaType: node.data?.type || 'direct',
      name: node.data?.name || '',
    },
  };
}

VideoNode.displayName = 'VideoNode'

export default VideoNode
