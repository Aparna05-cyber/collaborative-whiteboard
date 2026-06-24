import { useEffect, useState } from "react";
import Canvas from "./components/Canvas";
import Toolbar from "./components/Toolbar";
import type { Stroke } from "./types/drawing";
import { socket } from "./services/socket";

function App() {
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [redoStack, setRedoStack] = useState<Stroke[]>([]);

  const [selectedColor, setSelectedColor] = useState("black");
  const [brushSize, setBrushSize] = useState(3);

  useEffect(() => {
  socket.on("connect", () => {
    console.log("Connected:", socket.id);
  });

  socket.on("receive-stroke", (stroke: Stroke) => {
    setStrokes((prev) => [...prev, stroke]);
  });

  return () => {
    socket.off("connect");
    socket.off("receive-stroke");
  };
}, []);

  const addStroke = (stroke: Stroke) => {
  setStrokes((prev) => [...prev, stroke]);
  setRedoStack([]);

  socket.emit("draw-stroke", stroke);
};

  const undo = () => {
    setStrokes((prev) => {
      if (prev.length === 0) return prev;

      const lastStroke = prev[prev.length - 1];

      setRedoStack((redoPrev) => [
        ...redoPrev,
        lastStroke,
      ]);

      return prev.slice(0, -1);
    });
  };

  const redo = () => {
    setRedoStack((prev) => {
      if (prev.length === 0) return prev;

      const strokeToRestore = prev[prev.length - 1];

      setStrokes((strokePrev) => [
        ...strokePrev,
        strokeToRestore,
      ]);

      return prev.slice(0, -1);
    });
  };

  const clear = () => {
    setStrokes([]);
    setRedoStack([]);
  };

  return (
    <>
      <Toolbar
        onClear={clear}
        onUndo={undo}
        onRedo={redo}
        selectedColor={selectedColor}
        onColorChange={setSelectedColor}
        brushSize={brushSize}
        onBrushSizeChange={setBrushSize}
      />

      <Canvas
        strokes={strokes}
        addStroke={addStroke}
        selectedColor={selectedColor}
        brushSize={brushSize}
      />
    </>
  );
}

export default App;