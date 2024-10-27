'use client'

import React, { useState, useCallback, useMemo } from 'react'
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  MarkerType,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface MindMapNode {
  id: string
  label: string
  children: MindMapNode[]
}

const AdvancedMindMap: React.FC = () => {
  const [input, setInput] = useState('')
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)

  const generateMindMap = (text: string): MindMapNode => {
    const lines = text.split('\n').filter(line => line.trim() !== '')
    const root: MindMapNode = { id: '0', label: lines[0], children: [] }
    let currentNode = root
    let currentLevel = 0

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i]
      const level = line.search(/\S/)
      const label = line.trim()

      if (level > currentLevel) {
        const newNode: MindMapNode = { id: `${i}`, label, children: [] }
        currentNode.children.push(newNode)
        currentNode = newNode
      } else if (level === currentLevel) {
        const newNode: MindMapNode = { id: `${i}`, label, children: [] }
        currentNode = { ...currentNode, children: [...currentNode.children, newNode] }
      } else {
        while (level <= currentLevel) {
          currentNode = findParent(root, currentNode.id)!
          currentLevel--
        }
        const newNode: MindMapNode = { id: `${i}`, label, children: [] }
        currentNode.children.push(newNode)
        currentNode = newNode
      }

      currentLevel = level
    }

    return root
  }

  const findParent = (node: MindMapNode, id: string): MindMapNode | null => {
    if (node.children.some(child => child.id === id)) {
      return node
    }
    for (const child of node.children) {
      const result = findParent(child, id)
      if (result) return result
    }
    return null
  }

  const createNodesAndEdges = (node: MindMapNode, x = 0, y = 0, level = 0): { nodes: Node[]; edges: Edge[] } => {
    const nodes: Node[] = [
      {
        id: node.id,
        position: { x, y },
        data: { label: node.label },
        style: {
          background: level === 0 ? '#6366f1' : '#60a5fa',
          color: 'white',
          border: '1px solid #3730a3',
          width: 180,
          borderRadius: '5px',
          padding: '10px',
        },
      },
    ]
    const edges: Edge[] = []

    const childWidth = 250
    const childHeight = 100
    const childrenCount = node.children.length

    node.children.forEach((child, index) => {
      const childX = x - (childrenCount - 1) * childWidth / 2 + index * childWidth
      const childY = y + childHeight

      const childResult = createNodesAndEdges(child, childX, childY, level + 1)
      nodes.push(...childResult.nodes)
      edges.push(...childResult.edges)

      edges.push({
        id: `${node.id}-${child.id}`,
        source: node.id,
        target: child.id,
        type: 'smoothstep',
        markerEnd: {
          type: MarkerType.ArrowClosed,
        },
      })
    })

    return { nodes, edges }
  }

  const handleGenerateMindMap = () => {
    const mindMap = generateMindMap(input)
    const { nodes: newNodes, edges: newEdges } = createNodesAndEdges(mindMap)
    setNodes(newNodes)
    setEdges(newEdges)
  }

  const onConnect = useCallback((params: Connection) => setEdges((eds) => addEdge(params, eds)), [setEdges])

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node)
  }, [])

  const updateNodeLabel = (newLabel: string) => {
    if (selectedNode) {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === selectedNode.id) {
            return { ...node, data: { ...node.data, label: newLabel } }
          }
          return node
        })
      )
      setSelectedNode(null)
    }
  }

  const nodeTypes = useMemo(() => ({}), [])

  return (
    <div className="container mx-auto py-10">
      <Card className="w-full mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Advanced Career Path Mind Map Generator</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Textarea
              placeholder="Enter your career path text here..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full h-40"
            />
          </div>
          <Button onClick={handleGenerateMindMap}>Generate Mind Map</Button>
          <div style={{ width: '100%', height: '600px' }} className="mt-4">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onNodeClick={onNodeClick}
              nodeTypes={nodeTypes}
              fitView
            >
              <Controls />
              <Background color="#aaa" gap={16} />
            </ReactFlow>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="mt-4" disabled={!selectedNode}>Edit Selected Node</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Edit Node</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Input
                    id="name"
                    defaultValue={selectedNode?.data.label}
                    className="col-span-3"
                    onChange={(e) => updateNodeLabel(e.target.value)}
                  />
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  )
}

export default AdvancedMindMap