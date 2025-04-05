import { Box, Flex, Spinner, useColorModeValue } from '@chakra-ui/react'
import ReactFlow, {
  Background,
  Controls,
  useReactFlow,
  Node,
  Edge,
  ReactFlowProvider,
  MiniMap,
  Panel,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { useCallback, useEffect, useState, useRef } from 'react'
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
import WaitInputNode from '../components/nodes/inputs/WaitInputNode'
import PhoneInputNode from '../components/nodes/inputs/PhoneInputNode'
import ButtonsInputNode from '../components/nodes/inputs/ButtonsInputNode'
import PicChoiceInputNode from '../components/nodes/inputs/PicChoiceInputNode'
import PaymentInputNode from '../components/nodes/inputs/PaymentInputNode'
import { useLocation } from 'react-router-dom'
import { updateFlow, getFlow } from '../services/flowService'
import { exportFlowAsJson } from '../utils/exportFlowAsJson'
import { importFlowFromJson } from '../utils/importFlowFromJson'

const nodeTypes = {
  text: TextNode,
  image: ImageNode,
  video: VideoNode,
  audio: AudioNode,
  start: StartNode, // Nó "Start"
  input_text: TextInputNode,
  input_number: NumberInputNode,
  input_email: EmailInputNode,
  input_website: WebsiteInputNode,
  input_date: DateInputNode,
  input_wait: WaitInputNode,
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
    setEdges,
    updateNodeData,
  } = useFlowStore()
  const { screenToFlowPosition } = useReactFlow()
  const [isDragging, setIsDragging] = useState(false)
  const location = useLocation()
  const uid = new URLSearchParams(location.search).get('flow_id')
  const [isSaving, setIsSaving] = useState(false)

  const bgColor = useColorModeValue('gray.50', 'gray.900')
  const dropHighlightColor = useColorModeValue('blue.50', 'blue.900')

  useEffect(() => {
    if (nodes.length === 0) {
      setNodes([{
        id: 'start',
        type: 'start',
        position: { x: 200, y: 200 },
        data: {},
        deletable: false,
      }])
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

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      })

      // Default node labels mapped by type
      const defaultLabels: {[key: string]: string} = {
        text: 'Mensagem de Texto',
        image: 'Imagem',
        video: 'Vídeo',
        audio: 'Áudio',
        start: 'Start Node',
        input_text: 'Input - Texto',
        input_number: 'Input - Número',
        input_email: 'Input - E-mail',
        input_website: 'Input - Website',
        input_date: 'Input - Data',
        input_wait: 'Input - Aguarde',
        input_phone: 'Input - Telefone',
        input_buttons: 'Input - Botões',
        input_pic_choice: 'Input - Escolha de Imagem',
        input_payment: 'Input - Pagamento'
      };

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
          name: defaultLabels[type] || type.charAt(0).toUpperCase() + type.slice(1),
          onChange:
            type === 'text'
              ? (value: string) =>
                  updateNodeData(newNode.id, { text: value })
              : (field: string, value: string) =>
                  updateNodeData(newNode.id, { [field]: value }),
          onNameChange: (name: string) =>
            updateNodeData(newNode.id, { name })
        },
        dragHandle: '.drag',
      }

      addNode(newNode)
    },
    [screenToFlowPosition, addNode, updateNodeData]
  )

  const rehydratedNodes = nodes.map(node => {
    if (node.data && !node.data.onChange) {
      return {
        ...node,
        data: {
          ...node.data,
          onChange:
            node.type === 'text'
              ? (value: string) => updateNodeData(node.id, { text: value })
              : (field: string, value: string) =>
                  updateNodeData(node.id, { [field]: value }),
          onNameChange: (name: string) =>
            updateNodeData(node.id, { name })
        },
      }
    }
    return node
  })

  const saveTimeout = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!uid) return;

    if (saveTimeout.current) {
      clearTimeout(saveTimeout.current)
    }

    saveTimeout.current = setTimeout(async () => {
      setIsSaving(true)
      try {
        const exportData = exportFlowAsJson(nodes, edges)
        await updateFlow(uid, exportData)
      } catch (error) {
        console.error('Error saving flow:', error)
      } finally {
        setIsSaving(false)
      }
    }, 1000)
  }, [nodes, edges, uid])

  return (
    <Flex direction="column" h="100vh">
      <Flex flex={1} mt="56px">
        <Sidebar />
        <Box
          flex={1}
          bg={isDragging ? dropHighlightColor : bgColor}
          transition="background-color 0.1s ease-out"
          position="relative"
        >
          <ReactFlow
            nodes={rehydratedNodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            onDragOver={onDragOver}
            onDrop={onDrop}
            onDragLeave={onDragLeave}
            fitView={false}  // Desabilitar fitView para evitar ajuste automático
            minZoom={0.5}  // Zoom mínimo
            maxZoom={1.5}  // Zoom máximo
            defaultViewport={{ x: 0, y: 0, zoom: 0.8 }} // Ajuste de zoom inicial
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
            <Panel position="top-left">
              {isSaving && (
                <Box
                  bg={bgColor}
                  p={2}
                  borderRadius="md"
                  shadow="sm"
                  display="flex"
                  alignItems="center"
                >
                  <Spinner color="blue.500" speed="1s" mr={2} />
                  Saving...
                </Box>
              )}
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
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const flowId = queryParams.get('flow_id');
  const setNodes = useFlowStore(state => state.setNodes);
  const setEdges = useFlowStore(state => state.setEdges);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFlow() {
      // Sempre limpar antes de carregar novo fluxo!
      setNodes([])
      setEdges([])

      if (flowId) {
        try {
          const flowData = await getFlow(flowId);

          // Se flowData.content não existir, tratamos como vazio:
          const parsed = importFlowFromJson(flowData.content || { nodes: [], edges: [] });

          setNodes(parsed.nodes);
          setEdges(parsed.edges);
        } catch (error) {
          console.error('Error fetching flow:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    }
    fetchFlow();
  }, [flowId, setNodes, setEdges]);

  return (
    <ReactFlowProvider>
      <Header flowId={flowId} />
      {loading ? <Spinner size="xl" color="blue.500" /> : <EditorContent />}
    </ReactFlowProvider>
  )
}
