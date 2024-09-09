import { Handle, Position } from "@xyflow/react";
import { FC, useEffect, useRef, useState } from "react";
import { Node } from "@xyflow/react";

import { Upload } from "lucide-react";

interface ImageUploadComponentProps {
  value: File | null;
  onChange: (file: File | null) => void;
}

function ImageUploadComponent({ value, onChange }: ImageUploadComponentProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (value) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(value);
    } else {
      setPreview(null);
    }
  }, [value]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    onChange(file);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-64 aspect-square bg-gray-100 flex flex-col items-center justify-center p-4 rounded-lg shadow-md">
      <div className="text-lg font-semibold mb-2">Image</div>
      <div className="w-full h-40 bg-gray-200 rounded mb-2 flex items-center justify-center overflow-hidden">
        {preview ? (
          <img
            src={preview}
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

function createFileList(files: File[]) {
  // 创建一个 DataTransfer 对象
  const dataTransfer = new DataTransfer();

  // 将传入的每个 File 对象添加到 DataTransfer 对象中
  files.forEach((file) => {
    dataTransfer.items.add(file);
  });

  // 返回类似 FileList 的对象
  return dataTransfer.files;
}

const ImageModel$1: FC<{
  value: File;
  onChange(v: File | null): void;
}> = ({ onChange, value }) => {
  const ref = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    if (ref.current == null) return;
    if (value == null) return;
    ref.current.files = createFileList([value]);
  }, [value]);
  return (
    <>
      <Handle onConnect={console.log} type="target" position={Position.Top} />
      <ImageUploadComponent value={value} onChange={onChange} />
      <Handle type="source" position={Position.Bottom} id="a" />
      <Handle type="source" position={Position.Bottom} id="b" />
    </>
  );
};

const ImageModel: FC<Node> = (prop) => {
  const value = prop.data.value as File;
  return (
    <ImageModel$1
      {...prop}
      value={value}
      onChange={(v) => {
        prop.data.value = v;
      }}
    ></ImageModel$1>
  );
};
export default ImageModel;
