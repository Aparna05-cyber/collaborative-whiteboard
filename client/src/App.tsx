import { useEffect, useState } from "react";
import Canvas from "./components/Canvas";
import Toolbar from "./components/Toolbar";
import type { Stroke } from "./types/drawing";
import { socket } from "./services/socket";

function App() {
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [redoStack, setRedoStack] = useState<Stroke[]>([]);

  const [roomInput, setRoomInput] = useState("");
  const [roomId, setRoomId] = useState("");

  const [selectedColor, setSelectedColor] =
    useState("black");

  const [brushSize, setBrushSize] =
    useState(3);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected:", socket.id);
    });

    socket.on(
      "receive-stroke",
      (stroke: Stroke) => {
        setStrokes((prev) => [
          ...prev,
          stroke,
        ]);
      }
    );

    socket.on(
      "load-strokes",
      (savedStrokes: Stroke[]) => {
        setStrokes(savedStrokes);
      }
    );

    return () => {
      socket.off("connect");
      socket.off("receive-stroke");
      socket.off("load-strokes");
    };
  }, []);

  const joinRoom = () => {
    if (!roomInput.trim()) return;

    socket.emit("join-room", roomInput);

    setRoomId(roomInput);

    setRedoStack([]);

    console.log(
      `Joined room: ${roomInput}`
    );
  };

  const addStroke = (stroke: Stroke) => {
    setStrokes((prev) => [...prev, stroke]);

    setRedoStack([]);

    if (roomId) {
      socket.emit("draw-stroke", {
        roomId,
        stroke,
      });
    }
  };

  const undo = () => {
    setStrokes((prev) => {
      if (prev.length === 0) return prev;

      const lastStroke =
        prev[prev.length - 1];

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

      const strokeToRestore =
        prev[prev.length - 1];

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
      <div
        style={{
          position: "fixed",
          top: "20px",
          right: "20px",
          zIndex: 1000,
          background: "white",
          padding: "10px",
          border: "1px solid #ccc",
          borderRadius: "8px",
        }}
      >
        <input
          type="text"
          placeholder="Room Name"
          value={roomInput}
          onChange={(e) =>
            setRoomInput(e.target.value)
          }
        />

        <button onClick={joinRoom}>
          Join Room
        </button>

        <div>
          Current Room:{" "}
          {roomId || "Not Joined"}
        </div>
      </div>

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