import { Box, Flex, useColorModeValue } from '@chakra-ui/react'
import ReactFlow, {
  Background,
  Controls,
  useReactFlow,
  Node,
  ReactFlowProvider,
  MiniMap,
  Panel,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { useCallback, useEffect, useState } from 'react'
import { useFlowStore } from '../store/flowStore'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import TextNode from '../components/nodes/TextNode'
import ImageNode from '../components/nodes/ImageNode'
import VideoNode from '../components/nodes/VideoNode'
import AudioNode from '../components/nodes/AudioNode'
import StartNode from '../components/nodes/StartNode'
import TextInputNode from '../components/nodes/inputs/TextInputNode'
import NumberInputNode from '../components/nodes/inputs/NumberInputNode'
import EmailInputNode from '../components/nodes/inputs/EmailInputNode'
import WebsiteInputNode from '../components/nodes/inputs/WebsiteInputNode'
import DateInputNode from '../components/nodes/inputs/DateInputNode'
import TimeInputNode from '../components/nodes/inputs/TimeInputNode'
import PhoneInputNode from '../components/nodes/inputs/PhoneInputNode'
import ButtonsInputNode from '../components/nodes/inputs/ButtonsInputNode'
import PicChoiceInputNode from '../components/nodes/inputs/PicChoiceInputNode'
import PaymentInputNode from '../components/nodes/inputs/PaymentInputNode'

const nodeTypes = {
  text: TextNode,
  image: ImageNode,
  video: VideoNode,
  audio: AudioNode,
  start: StartNode,
  input_text: TextInputNode,
  input_number: NumberInputNode,
  input_email: EmailInputNode,
  input_website: WebsiteInputNode,
  input_date: DateInputNode,
  input_time: TimeInputNode,
  input_phone: PhoneInputNode,
  input_buttons: ButtonsInputNode,
  input_pic_choice: PicChoiceInputNode,
  input_payment: PaymentInputNode,
}

const proOptions = { hideAttribution: true }

function EditorContent() {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    setNodes,
    updateNodeData,
  } = useFlowStore()
  const { project } = useReactFlow()
  const [isDragging, setIsDragging] = useState(false)

  const bgColor = useColorModeValue('gray.50', 'gray.900')
  const dropHighlightColor = useColorModeValue('blue.50', 'blue.900')

  useEffect(() => {
    if (nodes.length === 0) {
      setNodes([
        {
          id: 'start',
          type: 'start',
          position: { x: 400, y: 100 },
          data: {},
        },
      ])
    }
  }, [nodes.length, setNodes])

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
    setIsDragging(true)
  }, [])

  const onDragLeave = useCallback(() => {
    setIsDragging(false)
  }, [])

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault()
      setIsDragging(false)

      const type = event.dataTransfer.getData('application/reactflow')
      if (!type) return

      const position = project({
        x: event.clientX - 240,
        y: event.clientY - 60,
      })

      const newNode: Node = {
        id: `${type}-${Date.now()}`,
        type,
        position,
        data: {
          text: '',
          imageUrl: '',
          alt: '',
          videoUrl: '',
          type: 'youtube',
          audioUrl: '',
          title: '',
          value: '',
          buttons: [],
          choices: [],
          amount: '',
          currency: 'BRL',
          description: '',
          onChange: (field: string, value: any) => {
            updateNodeData(newNode.id, { [field]: value })
          },
        },
        dragHandle: '.drag',
      }

      addNode(newNode)
    },
    [project, addNode, updateNodeData]
  )

  return (
    <Flex direction="column" h="100vh">
      <Header />
      <Flex flex={1} mt="56px">
        <Sidebar />
        <Box
          flex={1}
          bg={isDragging ? dropHighlightColor : bgColor}
          transition="background-color 0.1s ease-out"
          position="relative"
        >
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            onDragOver={onDragOver}
            onDrop={onDrop}
            onDragLeave={onDragLeave}
            fitView
            minZoom={0.5}
            maxZoom={2}
            defaultEdgeOptions={{
              type: 'smoothstep',
              animated: true,
            }}
            connectionRadius={50}
            proOptions={proOptions}
            deleteKeyCode={['Backspace', 'Delete']}
            multiSelectionKeyCode={['Control', 'Meta']}
            selectionKeyCode={null}
            snapToGrid={false}
            nodesDraggable={true}
            elementsSelectable={true}
            selectNodesOnDrag={false}
            panOnDrag={[1, 2]}
            zoomOnScroll={true}
            zoomOnPinch={true}
            preventScrolling={true}
            defaultViewport={{ x: 0, y: 0, zoom: 1 }}
          >
            <Background gap={16} size={1} />
            <Controls showInteractive={false} />
            <MiniMap
              nodeColor={useColorModeValue('#E2E8F0', '#2D3748')}
              maskColor={useColorModeValue('rgba(241, 245, 249, 0.5)', 'rgba(23, 25, 35, 0.5)')}
            />
            <Panel position="top-right">
              <Box bg={bgColor} p={2} borderRadius="md" shadow="sm">
                Use Ctrl + clique para selecionar múltiplos nós
              </Box>
            </Panel>
          </ReactFlow>
          {isDragging && (
            <Box
              position="absolute"
              top={0}
              left={0}
              right={0}
              bottom={0}
              pointerEvents="none"
              border="2px dashed"
              borderColor="blue.400"
              opacity={0.3}
              transition="opacity 0.1s ease-out"
              zIndex={1}
            />
          )}
        </Box>
      </Flex>
    </Flex>
  )
}

export default function Editor() {
  return (
    <ReactFlowProvider>
      <EditorContent />
    </ReactFlowProvider>
  )
}
