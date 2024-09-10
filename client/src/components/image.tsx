import { Handle, Position } from "@xyflow/react";
import { FC, useRef } from "react";
import { Node } from "@xyflow/react";

import { Upload } from "lucide-react";
import { uploadFiles } from "../controller/store";
import clsx from "clsx";
import useStore from "../controller/store";

interface ImageUploadComponentProps {
  selected?: boolean;
  value: string | null;
  onChange: (url: string | null) => void;
}

function ImageUploadComponent({
  value,
  onChange,
  selected,
}: ImageUploadComponentProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0] || null;
    if (file == null) return;
    const url = (await uploadFiles([file])).get(file);
    if (url == null) return;
    onChange(url);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      className={clsx(
        "w-64 aspect-square bg-gray-100 flex flex-col items-center justify-center p-4 rounded-lg shadow-md",
        {
          "outline-black outline outline-1": selected,
        }
      )}
    >
      <div className="text-lg font-semibold mb-2">Image</div>
      <div className="w-full h-40 bg-gray-200 rounded mb-2 flex items-center justify-center overflow-hidden">
        {value ? (
          <img
            src={value}
            alt="Preview"
            className="w-full h-full object-cover"
          />
        ) : (
          <Upload className="text-gray-400" size={32} />
        )}
      </div>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        ref={fileInputRef}
        className="hidden"
      />
      <button onClick={handleUploadClick} className="w-full">
        {value ? "Change Image" : "Upload Image"}
      </button>
    </div>
  );
}

const ImageModel$1: FC<{
  value: string;
  onChange(v: string | null): void;
}> = ({ onChange, value, ...rest }) => {
  return (
    <>
      <Handle onConnect={console.log} type="target" position={Position.Top} />
      <ImageUploadComponent value={value} onChange={onChange} {...rest} />
      <Handle type="source" position={Position.Bottom} id="a" />
      <Handle type="source" position={Position.Bottom} id="b" />
    </>
  );
};

const ImageModel: FC<Node> = (prop) => {
  const value = prop.data.value as string;
  const { onChange } = useStore();
  return (
    <ImageModel$1
      {...prop}
      value={value}
      onChange={async (v) => {
        if (v == null) return;
        onChange(prop.id, v);
      }}
    ></ImageModel$1>
  );
};
export default ImageModel;
