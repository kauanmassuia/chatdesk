import { create } from 'zustand'
import { Node, Edge, OnNodesChange, OnEdgesChange, Connection, addEdge, applyNodeChanges, applyEdgeChanges } from 'reactflow'

interface FlowState {
  nodes: Node[]
  edges: Edge[]
  onNodesChange: OnNodesChange
  onEdgesChange: OnEdgesChange
  onConnect: (connection: Connection) => void
  addNode: (node: Node) => void
  setNodes: (nodes: Node[]) => void
  updateNodeData: (nodeId: string, data: any) => void
}

export const useFlowStore = create<FlowState>((set) => ({
  nodes: [],
  edges: [],
  onNodesChange: (changes) => {
    set((state) => ({
      nodes: applyNodeChanges(changes, state.nodes),
    }))
  },
  onEdgesChange: (changes) => {
    set((state) => ({
      edges: applyEdgeChanges(changes, state.edges),
    }))
  },
  onConnect: (connection) => {
    set((state) => ({
      edges: addEdge(connection, state.edges),
    }))
  },
  addNode: (node) => {
    set((state) => ({
      nodes: [...state.nodes, node],
    }))
  },
  setNodes: (nodes) => {
    set({ nodes })
  },
  updateNodeData: (nodeId, newData) => {
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, ...newData } }
          : node
      ),
    }))
  },
}))

export const exportFlow = (nodes: Node[], edges: Edge[]): string => {
  const edgeMap = new Map(edges.map(edge => [edge.source, edge.target]));

  const exportedNodes = nodes.map(node => {
    return {
      id: node.id,
      type: node.type,
      position: node.position,
      data: {
        text: node.data.text ?? '' // Ensure text is not undefined
      },
      next: edgeMap.get(node.id) || null // Find the next node via edges
    };
  });

  return JSON.stringify({ nodes: exportedNodes, edges }, null, 2);
};
