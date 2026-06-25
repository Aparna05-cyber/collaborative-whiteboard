type ToolbarProps = {
  onClear: () => void;
  onUndo: () => void;
  onRedo: () => void;

  selectedColor: string;
  onColorChange: (color: string) => void;

  brushSize: number;
  onBrushSizeChange: (size: number) => void;
};

function Toolbar({
  onClear,
  onUndo,
  onRedo,
  selectedColor,
  onColorChange,
  brushSize,
  onBrushSizeChange,
}: ToolbarProps) {
  return (
  <div className="sidebar">
    <h3>Tools</h3>

    <p>Colors</p>

    <div className="color-row">
      <div
        className="color-circle"
        style={{
          background: "black",
        }}
        onClick={() =>
          onColorChange("black")
        }
      />

      <div
        className="color-circle"
        style={{
          background: "red",
        }}
        onClick={() =>
          onColorChange("red")
        }
      />

      <div
        className="color-circle"
        style={{
          background: "blue",
        }}
        onClick={() =>
          onColorChange("blue")
        }
      />

      <div
        className="color-circle"
        style={{
          background: "green",
        }}
        onClick={() =>
          onColorChange("green")
        }
      />

      <div
        className="color-circle"
        style={{
          background: "#f1f5f9",
          border:
            "1px solid #cbd5e1",
        }}
        onClick={() =>
          onColorChange("white")
        }
      />
    </div>

    <p>
      Brush Size : {brushSize}
    </p>

    <input
      className="brush-slider"
      type="range"
      min="1"
      max="20"
      value={brushSize}
      onChange={(e) =>
        onBrushSizeChange(
          Number(e.target.value)
        )
      }
    />

    <button
      className="tool-button"
      onClick={onUndo}
    >
      ↩ Undo
    </button>

    <button
      className="tool-button"
      onClick={onRedo}
    >
      ↪ Redo
    </button>

    <button
      className="tool-button"
      onClick={onClear}
    >
      🧹 Clear
    </button>
  </div>
);
}

export default Toolbar;