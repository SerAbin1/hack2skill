// src/utils/roadmapToFlow.js
let idCounter = 1;
const getId = () => `${idCounter++}`;

export function roadmapToFlow(data) {
  const nodes = [];
  const edges = [];
  const itemsMap = new Map(); // To store item references

  function createNode(item, type = "secondary") {
    const nodeId = getId();
    nodes.push({
      id: nodeId,
      data: { 
        label: item.title, 
        checked: item.isDone || false 
      },
      position: { x: 0, y: 0 },
      style: {
        background:
          type === "primary"
            ? "#FACC15"
            : type === "secondary"
            ? "#60A5FA"
            : "#D1D5DB",
        padding: 10,
        borderRadius: 8,
      },
      type: 'checkboxNode',
    });
    itemsMap.set(nodeId, item);
    return nodeId;
  }

  function traverse(items, parentId = null, connectSequential = false) {
    let prevId = null;

    items.forEach((item) => {
      let nodeId;

      if (item.isGroup) {
        // Create a node for the group title
        nodeId = createNode({ title: item.title, isDone: false }, "primary");
        if (parentId) {
          edges.push({ id: `e${parentId}-${nodeId}`, source: parentId, target: nodeId, animated: true });
        }
        if (connectSequential && prevId) {
          edges.push({ id: `e${prevId}-${nodeId}`, source: prevId, target: nodeId, animated: true });
        }
        // Traverse its children without connecting them sequentially
        if (item.items) {
          traverse(item.items, nodeId, false);
        }
      } else {
        nodeId = createNode(item, item.type);
        if (parentId) {
          edges.push({ id: `e${parentId}-${nodeId}`, source: parentId, target: nodeId, animated: true });
        }
        if (connectSequential && prevId) {
          edges.push({ id: `e${prevId}-${nodeId}`, source: prevId, target: nodeId, animated: true });
        }
        if (item.subItems) {
          traverse(item.subItems, nodeId, false);
        }
      }
      prevId = nodeId;
    });
  }

  traverse(data.path, null, true);

  return { nodes, edges, itemsMap };
}