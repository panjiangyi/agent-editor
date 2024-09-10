import { Handle, Position } from "@xyflow/react";
import { FC } from "react";
import { Node } from "@xyflow/react";
import useStore, { useResultStore } from "../controller/store";
import clsx from "clsx";

const TextModel$1: FC<{
  selected?: boolean;
  id: string;
  value: string;
  onChange(v: string): void;
}> = ({ value, onChange, id, selected }) => {
  const { getResultById } = useResultStore();
  const result = getResultById(id);
  return (
    <>
      <Handle onConnect={console.log} type="target" position={Position.Top} />
      <div
        className={clsx(
          "w-64 aspect-square bg-gray-100 flex flex-col items-center justify-center p-4 rounded-lg shadow-md",
          {
            "outline-black outline outline-1": selected,
          }
        )}
      >
        <div className="text-lg font-semibold mb-2">Text</div>
        <input
          value={value}
          onInput={(e) => {
            if (e.target instanceof HTMLInputElement) {
              onChange(e.target.value);
            }
          }}
          className="w-full border border-grey-50 border-solid"
        ></input>
        {result && (
          <div className="w-full p-2 bg-gray-200 rounded">Output:{result}</div>
        )}
      </div>
      <Handle type="source" position={Position.Bottom} id="a" />
      <Handle type="source" position={Position.Bottom} id="b" />
    </>
  );
};

const TextModel: FC<Node> = (prop) => {
  const value = prop.data.value as string;
  const { onChange } = useStore();
  return (
    <TextModel$1
      {...prop}
      value={value}
      onChange={(v) => {
        onChange(prop.id, v);
      }}
    ></TextModel$1>
  );
};

export default TextModel;
