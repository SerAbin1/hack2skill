// src/components/RoadmapFlow.jsx
import React, { useMemo, useCallback } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Controls,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { roadmapToFlow } from "../utils/RoadmapToFlow";
import { getLayoutedElements } from "../utils/layout";
import CheckboxNode from "./CheckboxNode";

// Custom node type
const nodeTypes = { checkboxNode: CheckboxNode };

const RoadmapFlow = ({ roadmapData }) => {
  // Prepare nodes + edges from roadmap data
  const { initialNodes, initialEdges } = useMemo(() => {
    if (!roadmapData) return { initialNodes: [], initialEdges: [] };

    const { nodes: newNodes, edges: newEdges } = roadmapToFlow(roadmapData);
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      newNodes,
      newEdges,
      "LR" // 👈 Horizontal layout (Left → Right)
    );

    // Add checkbox click handler
    const nodesWithCheckHandler = layoutedNodes.map((node) => ({
      ...node,
      data: {
        ...node.data,
        onCheck: () => {
          console.log(`Checkbox clicked for node: ${node.data.label}`);
        },
      },
    }));

    // Style edges (smoothstep + animated)
    const styledEdges = layoutedEdges.map((edge) => ({
      ...edge,
      type: "smoothstep",
      animated: true,
    }));

    return { initialNodes: nodesWithCheckHandler, initialEdges: styledEdges };
  }, [roadmapData]);

  // Local state for nodes + edges
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Handle manual connections
  const onConnect = useCallback(
    (params) =>
      setEdges((eds) =>
        addEdge({ ...params, type: "smoothstep", animated: true }, eds)
      ),
    [setEdges]
  );

  return (
    <div style={{ width: "100%", height: "90vh" }}>
      <ReactFlowProvider>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
          attributionPosition="bottom-left"
        >
          <Background gap={16} color="#aaa" />
          <Controls />
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  );
};

export default RoadmapFlow;
