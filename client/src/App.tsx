import {
  Background,
  Controls as ReactflowControls,
  MiniMap,
  ReactFlow,
  ReactFlowProvider,
} from "@xyflow/react";
import TextModel from "./components/text.tsx";
import ImageModel from "./components/image.tsx";
import "@xyflow/react/dist/style.css";

import useStore, {
  buildTree,
  runModels,
  useResultStore,
} from "./controller/store";
import { Controls } from "./components/controls.tsx";

const nodeTypes = {
  TextModel,
  ImageModel,
};

const Flow = () => {
  const {
    nodes,
    edges,
    reset,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addBranch,
  } = useStore();

  const { saveResult } = useResultStore();
  return (
    <>
      <Controls
        onReset={reset}
        onSave={async () => {
          const tree = buildTree(nodes, edges);
          const resultMap = await runModels(tree);
          saveResult(resultMap);
        }}
        onAddTextModel={(exp) => {
          const selectedNode = nodes.find((node) => node.selected);
          if (selectedNode == null) return;
          addBranch("TextModel", selectedNode.id, exp);
        }}
        onAddImageModel={(exp) => {
          const selectedNode = nodes.find((node) => node.selected);
          if (selectedNode == null) return;
          addBranch("ImageModel", selectedNode.id, exp);
        }}
      ></Controls>
      <div style={{ height: "90vh", width: "100vw" }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          nodeTypes={nodeTypes as unknown as any} // 注册自定义节点类型
          fitView
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
        >
          <ReactflowControls />
          <MiniMap />
          <Background />
        </ReactFlow>
      </div>
    </>
  );
};

export default function App() {
  return (
    <ReactFlowProvider>
      <Flow />
    </ReactFlowProvider>
  );
}
