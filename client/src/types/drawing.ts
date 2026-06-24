export type Point = {
  x: number;
  y: number;
};

export type Stroke = {
  color: string;
  brushSize: number;
  points: Point[];
};

export type DrawingData = Stroke[];