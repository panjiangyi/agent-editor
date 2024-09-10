import { FC, useState } from "react";
import { Plus } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { ComponentType } from "../controller/types";

const ExpressionEditor: FC<{
  open: boolean;
  onClose(): void;
  onDone(exp: string): void;
}> = ({ onDone, open, onClose }) => {
  const [expression, setExpression] = useState("");
  const isOpen = open;

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(v) => {
        if (v) return;
        onClose();
      }}
    >
      <Dialog.Trigger asChild>
        <button className="absolute bottom-2 right-2">
          <Plus className="h-4 w-4" />
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg w-80">
          <Dialog.Title className="text-lg font-semibold mb-4">
            Edit Expression
          </Dialog.Title>
          <input
            value={expression}
            onChange={(e) => setExpression(e.target.value)}
            placeholder="Enter expression"
            className="mb-4"
          />
          <div className="flex justify-end space-x-2">
            <button onClick={() => onClose()}>Cancel</button>
            <button
              onClick={() => {
                onDone(expression);
                onClose();
              }}
            >
              Save
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export const Controls: React.FC<{
  onAddTextModel: (exp?: string) => void;
  onAddImageModel: (exp?: string) => void;
  onSave: () => void;
  onReset: () => void;
}> = ({ onAddTextModel, onAddImageModel, onSave, onReset }) => {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<ComponentType>("TextModel");
  return (
    <>
      <div style={{ display: "flex", gap: 10 }}>
        <button
          onClick={() => {
            setType("TextModel");
            setOpen(true);
          }}
        >
          Add a text model
        </button>
        <button
          onClick={() => {
            setType("ImageModel");
            setOpen(true);
          }}
        >
          Add an image model
        </button>
        <button onClick={onSave}>Run</button>
        <button onClick={onReset}>Reset</button>
      </div>
      <ExpressionEditor
        open={open}
        onClose={() => setOpen(false)}
        onDone={(exp) => {
          if (type === "ImageModel") {
            onAddImageModel(exp);
          } else {
            onAddTextModel(exp);
          }
        }}
      />
    </>
  );
};
