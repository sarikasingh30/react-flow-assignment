import React, { useState, useCallback } from "react";
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
} from "reactflow";
import "reactflow/dist/style.css";
import "./App.css";
import TextNode from "./CustomNodes";
import { AiOutlineMessage } from "react-icons/ai";
import { SettingPanel } from "./components/SettingPanel";

const nodeTypes = {
  textNode: TextNode,
};

let id = 0;
const getId = () => `dndnode_${id++}`;

function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [saved, setSaved] = useState(true);

  const onConnect = useCallback(
    (params) => {
      setEdges((eds) => {
        const existingEdges = eds.filter(
          (edge) =>
            edge.source !== params.source ||
            edge.sourceHandle !== params.sourceHandle
        );
        return addEdge(params, existingEdges);
      });
    },
    [setEdges]
  );

  // Drop Node Function
  
  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const reactFlowBounds = event.target.getBoundingClientRect();
      const type = event.dataTransfer.getData("application/reactflow");
      if (typeof type === "undefined" || !type) return;

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });
      const newNode = {
        id: getId(),
        type,
        position,
        data: { text: "" },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes]
  );


  // Saved Functionality
  const saveFlow = () => {
    const nodesWithNoTargets = nodes.filter(
      (node) => !edges.some((edge) => edge.target === node.id)
    );

    if (nodesWithNoTargets.length > 1) {
      setSaved(false);
      alert("Error: More than one node with empty target handles");
      return;
    } else {
      const flow = { nodes, edges };
      console.log("Saved flow:", flow);
      alert("Flow saved successfully");
    }
  };

  return (
    <div>
      <div className="nav">
        {saved === false ? <button>Cannot save Flow</button> : ""}
        <button onClick={saveFlow}>Save Changes</button>
      </div>
      <div className="dndflow">
        <div
          className="flow-area"
          onDrop={onDrop}
          onDragOver={(event) => event.preventDefault()}
        >
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={(event, node) => setSelectedNode(node)}
            onInit={setReactFlowInstance}
            nodeTypes={nodeTypes}
            fitView
          >
            <MiniMap />
            <Controls />
            <Background variant="none" />
          </ReactFlow>
        </div>

        <div className="nodes-panel">
          <div
            className="node"
            onDragStart={(event) =>
              event.dataTransfer.setData("application/reactflow", "textNode")
            }
            draggable
          >
            <AiOutlineMessage size={25} />
            <p>Message</p>
          </div>
          <SettingPanel
            selectedNode={selectedNode}
            setNodes={setNodes}
            setSelectedNode={setSelectedNode}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
