import { useEffect, useRef } from "react";
import type { Point, Stroke } from "../types/drawing";

type CanvasProps = {
  strokes: Stroke[];
  addStroke: (stroke: Stroke) => void;
  selectedColor: string;
  brushSize: number;
};

function Canvas({
  strokes,
  addStroke,
  selectedColor,
  brushSize,
}: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const isDrawing = useRef(false);
  const currentStroke = useRef<Stroke | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    strokes.forEach((stroke) => {
      if (stroke.points.length < 2) return;

      ctx.beginPath();
      ctx.strokeStyle = stroke.color;
      ctx.lineWidth = stroke.brushSize;
      ctx.lineCap = "round";

      ctx.moveTo(stroke.points[0].x, stroke.points[0].y);

      for (let i = 1; i < stroke.points.length; i++) {
        ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
      }

      ctx.stroke();
    });
  }, [strokes]);

  const getPoint = (e: MouseEvent): Point => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();

    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const startDrawing = (e: MouseEvent) => {
    isDrawing.current = true;

    currentStroke.current = {
      color: selectedColor,
      brushSize,
      points: [getPoint(e)],
    };
  };

  const draw = (e: MouseEvent) => {
    if (!isDrawing.current || !currentStroke.current) return;

    currentStroke.current.points.push(getPoint(e));

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (!canvas || !ctx) return;

    const points = currentStroke.current.points;
    const len = points.length;

    if (len < 2) return;

    ctx.beginPath();
    ctx.strokeStyle = selectedColor;
    ctx.lineWidth = brushSize;
    ctx.lineCap = "round";

    ctx.moveTo(points[len - 2].x, points[len - 2].y);
    ctx.lineTo(points[len - 1].x, points[len - 1].y);

    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing.current) return;

    isDrawing.current = false;

    if (currentStroke.current) {
      addStroke(currentStroke.current);
      currentStroke.current = null;
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.addEventListener("mousedown", startDrawing);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", stopDrawing);
    canvas.addEventListener("mouseleave", stopDrawing);

    return () => {
      canvas.removeEventListener("mousedown", startDrawing);
      canvas.removeEventListener("mousemove", draw);
      canvas.removeEventListener("mouseup", stopDrawing);
      canvas.removeEventListener("mouseleave", stopDrawing);
    };
  }, [selectedColor, brushSize]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        display: "block",
      }}
    />
  );
}

export default Canvas;