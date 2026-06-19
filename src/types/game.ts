export interface Position {
  row: number;
  col: number;
}

export interface Level {
  id: number;
  name: string;
  gridSize: number;
  startPosition: Position;
  obstacles?: Position[];
}

export type GameStatus = 'idle' | 'playing' | 'completed';

export type ViewMode = 'select' | 'game';

export interface PlayerProgress {
  unlockedLevel: number;
  completedLevels: number[];
}

export const isSamePosition = (a: Position, b: Position): boolean => {
  return a.row === b.row && a.col === b.col;
};

export const isAdjacent = (a: Position, b: Position): boolean => {
  const rowDiff = Math.abs(a.row - b.row);
  const colDiff = Math.abs(a.col - b.col);
  return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
};

export const isObstacle = (pos: Position, obstacles: Position[] = []): boolean => {
  return obstacles.some((o) => isSamePosition(o, pos));
};

export const getTotalFillableCells = (gridSize: number, obstacles: Position[] = []): number => {
  return gridSize * gridSize - obstacles.length;
};
