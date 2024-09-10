import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  Node,
  Edge,
} from "@xyflow/react";

import initialNodes from "./nodes.ts";
import initialEdges from "./edges.ts";
import { AppState } from "./types.ts";
import { uuid } from "../utils/uuid.ts";
import axios from "axios";
import _ from "lodash";

// this is our useStore hook that we can use in our components to get parts of the store and call actions
const useStore = create(
  persist<AppState>(
    (set, get) => ({
      nodes: initialNodes,
      edges: initialEdges,
      onNodesChange: (changes) => {
        set({
          nodes: applyNodeChanges(changes, get().nodes),
        });
      },
      onEdgesChange: (changes) => {
        set({
          edges: applyEdgeChanges(changes, get().edges),
        });
      },
      onConnect: (connection) => {
        set({
          edges: addEdge(connection, get().edges),
        });
      },
      setNodes: (nodes) => {
        set({ nodes });
      },
      reset: () => {
        set({ nodes: initialNodes, edges: initialEdges });
      },
      setEdges: (edges) => {
        set({ edges });
      },
      onChange(id, value) {
        set((store) => {
          return {
            nodes: store.nodes.map((node) => {
              if (node.id !== id) return node;
              return {
                ...node,
                data: {
                  ...node.data,
                  value,
                },
              };
            }),
          };
        });
      },
      addBranch(type, parentId, exp) {
        const nodes = get().nodes;
        const index = nodes.length;
        const id = uuid();
        set((store) => {
          return {
            nodes: [
              ...nodes,
              {
                id,
                position: { x: 0, y: 400 * index },
                type,
                data: {
                  value: "",
                  if: exp,
                },
              },
            ],
            edges: [
              ...store.edges,
              {
                id: `edge-${uuid()}`,
                source: parentId,
                target: id,
              },
            ],
          };
        });
      },
    }),
    {
      name: "pages-data",
      getStorage: () => localStorage,
    }
  )
);

export default useStore;

// 创建一个节点的map, 方便通过id快速找到节点
type NodeWithChildren = Node & {
  children: NodeWithChildren[];
};
export function buildTree(nodes: Node[], edges: Edge[]) {
  const nodeMap = new Map<string, NodeWithChildren>(
    nodes.map((node) => [node.id, { ...node, children: [] }])
  );

  // 遍历edges数组，构建父子关系
  edges.forEach((edge) => {
    const parent = nodeMap.get(edge.source);
    const child = nodeMap.get(edge.target);

    if (parent != null && child != null) {
      parent.children.push(child);
    }
  });

  // 过滤出没有被其他节点作为target的节点作为根节点
  const targetIds = new Set(edges.map((edge) => edge.target));
  const roots = nodes.filter((node) => !targetIds.has(node.id));

  // 返回根节点，如果有多个根节点，返回一个数组
  return _.compact(roots.map((root) => nodeMap.get(root.id)));
}

export async function uploadFiles(files: File[]) {
  const file2UrlMap = new Map<File, string>();
  await Promise.all(
    files.map(async (file) => {
      const formData = new FormData();
      formData.append("image", file);

      const { data } = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/upload-image`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(data);
      const url = data.url;
      file2UrlMap.set(file, url);
      return data.url;
    })
  );
  return file2UrlMap;
}

export async function runModels(tree: NodeWithChildren[]) {
  const res = await axios.post<{ data: Record<string, string> }>(
    `${import.meta.env.VITE_API_BASE_URL}/api/nodes`,
    {
      data: tree,
    }
  );
  return res.data.data;
}

type ResultStore = {
  result: Record<string, string>;
  saveResult(v: Record<string, string>): void;
  getResultById(id: string): string;
};

export const useResultStore = create<ResultStore>((set, get) => ({
  result: {},
  saveResult: (v) => set(() => ({ result: v })),
  getResultById: (id) => get().result[id],
}));
