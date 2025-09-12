import React, { useMemo } from "react";
import ReactFlow, { Background, Controls } from "reactflow";
import "reactflow/dist/style.css";
import { roadmapToFlow } from "../utils/RoadmapToFlow";
import { getLayoutedElements } from "../utils/layout";
import CheckboxNode from "./CheckboxNode";

const nodeTypes = { checkboxNode: CheckboxNode };

const RoadmapFlow = ({ roadmapData }) => {
  const { nodes, edges } = useMemo(() => {
    if (!roadmapData) return { nodes: [], edges: [] };

    const { nodes: newNodes, edges: newEdges } = roadmapToFlow(roadmapData);
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      newNodes,
      newEdges,
      "TB"
    );
    return { nodes: layoutedNodes, edges: layoutedEdges };
  }, [roadmapData]);

  // Handle the onCheck functionality by adding it to the node data
  const nodesWithCheckHandler = useMemo(() => {
    return nodes.map((node) => ({
      ...node,
      data: {
        ...node.data,
        onCheck: () => {
          console.log(`Checkbox clicked for node: ${node.data.label}`);
          // You can add logic here to update the state if you decide to make it interactive later
        },
      },
    }));
  }, [nodes]);

  return (
    <div style={{ width: "100%", height: "90vh" }}>
      <ReactFlow
        nodes={nodesWithCheckHandler}
        edges={edges}
        fitView
        nodeTypes={nodeTypes}
      >
        <Background gap={16} color="#aaa" />
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default RoadmapFlow;