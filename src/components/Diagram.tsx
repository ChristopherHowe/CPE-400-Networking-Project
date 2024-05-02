import { useState, useContext, useEffect } from 'react';
import ReactFlow, {
  FitViewOptions,
  Node,
  Edge,
  NodeTypes,
  DefaultEdgeOptions,
  Background,
  MarkerType,
  BackgroundVariant,
  EdgeChange,
  NodeChange,
  Connection,
} from 'reactflow';
import 'reactflow/dist/style.css';
import HostNode from './HostNode';
import RouterNode from './RouterNode';

const fitViewOptions: FitViewOptions = {
  padding: 0.2,
};

const defaultEdgeOptions: DefaultEdgeOptions = {
  animated: false,
  style: {
    strokeWidth: 2.5,
    stroke: '#D3DEE4',
  },
};

const nodeTypes: NodeTypes = {
  hostNode: HostNode,
  routerNode: RouterNode,
};

interface DiagramProps {
  nodes: Node[];
  onNodesChange: any;
  edges: Edge[];
  onEdgesChange: any;
  onConnect: any;
}

export default function Diagram(props: DiagramProps) {
  const { nodes, onNodesChange, edges, onEdgesChange, onConnect } = props;

  return (
    <div className="border border-solid border-gray-300 h-full rounded-lg">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        fitViewOptions={fitViewOptions}
        defaultEdgeOptions={defaultEdgeOptions}
        nodeTypes={nodeTypes}
        nodesDraggable={true}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
      >
        <Background gap={30} color="#f1f1f1" variant={BackgroundVariant.Lines} />
      </ReactFlow>
    </div>
  );
}
