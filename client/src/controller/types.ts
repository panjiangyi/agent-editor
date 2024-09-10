import {
  Edge,
  Node,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
} from "@xyflow/react";

export type AppNode = Node;
export type ComponentType = "TextModel" | "ImageModel";

export type AppState = {
  nodes: AppNode[];
  edges: Edge[];
  onNodesChange: OnNodesChange<AppNode>;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  setNodes: (nodes: AppNode[]) => void;
  setEdges: (edges: Edge[]) => void;
  reset(): void;
  addBranch: (type: ComponentType, parentId: string, exp?: string) => void;
  onChange: (id: string, value: string | File) => void;
};
