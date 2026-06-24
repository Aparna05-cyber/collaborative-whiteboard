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
    <div
      style={{
        position: "fixed",
        top: "20px",
        left: "20px",
        backgroundColor: "white",
        padding: "10px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        zIndex: 1000,
        display: "flex",
        gap: "10px",
        alignItems: "center",
        flexWrap: "wrap",
      }}
    >
      <button onClick={onClear}>Clear</button>
      <button onClick={onUndo}>Undo</button>
      <button onClick={onRedo}>Redo</button>

      <button onClick={() => onColorChange("black")}>Black</button>
      <button onClick={() => onColorChange("red")}>Red</button>
      <button onClick={() => onColorChange("blue")}>Blue</button>
      <button onClick={() => onColorChange("green")}>Green</button>
      <button onClick={() => onColorChange("white")}>Eraser</button>

      <span>Current: {selectedColor}</span>

      <span>Brush:</span>

      <button onClick={() => onBrushSizeChange(1)}>1</button>
      <button onClick={() => onBrushSizeChange(3)}>3</button>
      <button onClick={() => onBrushSizeChange(5)}>5</button>
      <button onClick={() => onBrushSizeChange(10)}>10</button>

      <span>Size: {brushSize}</span>
    </div>
  );
}

export default Toolbar;