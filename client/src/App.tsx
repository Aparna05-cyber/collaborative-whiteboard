import { useEffect, useRef, useState } from "react";
import Canvas from "./components/Canvas";
import Toolbar from "./components/Toolbar";
import type { Stroke } from "./types/drawing";
import { socket } from "./services/socket";
import "./styles/ui.css";
import "./App.css";

function App() {
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [redoStack, setRedoStack] = useState<Stroke[]>([]);

  const [roomInput, setRoomInput] = useState("");
  const [roomId, setRoomId] = useState("");

  const roomRef = useRef("");

  const [selectedColor, setSelectedColor] =
    useState("black");

  const [brushSize, setBrushSize] =
    useState(3);

  useEffect(() => {
    socket.on("connect", () => {
      console.log(
        "Connected:",
        socket.id
      );
    });

    socket.on(
      "board-updated",
      (updatedStrokes: Stroke[]) => {
        setStrokes(updatedStrokes);
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
      socket.off("board-updated");
      socket.off("load-strokes");
    };
  }, []);

  const joinRoom = () => {
    const room = roomInput.trim();

    if (!room) return;

    roomRef.current = room;

    setRoomId(room);

    setStrokes([]);
    setRedoStack([]);

    socket.emit(
      "join-room",
      room
    );
  };

  const addStroke = (stroke: Stroke) => {
    const updatedStrokes = [
      ...strokes,
      stroke,
    ];

    setStrokes(updatedStrokes);

    setRedoStack([]);

    if (!roomRef.current) return;

    socket.emit(
      "draw-stroke",
      {
        roomId:
          roomRef.current,
        stroke,
      }
    );
  };

  const undo = () => {
    if (strokes.length === 0)
      return;

    const lastStroke =
      strokes[strokes.length - 1];

    const updatedStrokes =
      strokes.slice(0, -1);

    setRedoStack((prev) => [
      ...prev,
      lastStroke,
    ]);

    setStrokes(updatedStrokes);

    if (roomRef.current) {
      socket.emit(
        "sync-board",
        {
          roomId:
            roomRef.current,
          strokes:
            updatedStrokes,
        }
      );
    }
  };

  const redo = () => {
    if (redoStack.length === 0)
      return;

    const strokeToRestore =
      redoStack[
        redoStack.length - 1
      ];

    const updatedRedo =
      redoStack.slice(0, -1);

    const updatedStrokes = [
      ...strokes,
      strokeToRestore,
    ];

    setRedoStack(updatedRedo);

    setStrokes(updatedStrokes);

    if (roomRef.current) {
      socket.emit(
        "sync-board",
        {
          roomId:
            roomRef.current,
          strokes:
            updatedStrokes,
        }
      );
    }
  };

  const clear = () => {
    setStrokes([]);
    setRedoStack([]);

    if (roomRef.current) {
      socket.emit(
        "sync-board",
        {
          roomId:
            roomRef.current,
          strokes: [],
        }
      );
    }
  };

  return (
    <>
      return (
  <>
    <div className="topbar">
      <h2>
        Collaborative Whiteboard
      </h2>

      <div
        style={{
          display: "flex",
          gap: "10px",
        }}
      >
        <input
          type="text"
          placeholder="Room Name"
          value={roomInput}
          onChange={(e) =>
            setRoomInput(
              e.target.value
            )
          }
        />

        <button
          className="tool-button"
          onClick={joinRoom}
        >
          Join
        </button>
      </div>

      <div className="room-status">
        🟢 {roomId || "Offline"}
      </div>
    </div>

    <Toolbar
      onClear={clear}
      onUndo={undo}
      onRedo={redo}
      selectedColor={
        selectedColor
      }
      onColorChange={
        setSelectedColor
      }
      brushSize={
        brushSize
      }
      onBrushSizeChange={
        setBrushSize
      }
    />

    <Canvas
      strokes={strokes}
      addStroke={addStroke}
      selectedColor={
        selectedColor
      }
      brushSize={
        brushSize
      }
    />
  </>
);

      <Toolbar
        onClear={clear}
        onUndo={undo}
        onRedo={redo}
        selectedColor={
          selectedColor
        }
        onColorChange={
          setSelectedColor
        }
        brushSize={
          brushSize
        }
        onBrushSizeChange={
          setBrushSize
        }
      />

      <Canvas
        strokes={strokes}
        addStroke={
          addStroke
        }
        selectedColor={
          selectedColor
        }
        brushSize={
          brushSize
        }
      />
    </>
  );
}

export default App;