import { Position, isSamePosition, isAdjacent } from '../types/game';

export const isPositionInPath = (pos: Position, path: Position[]): boolean => {
  return path.some((p) => isSamePosition(p, pos));
};

export const canMoveTo = (
  targetPos: Position,
  currentPath: Position[],
  gridSize: number
): boolean => {
  if (targetPos.row < 0 || targetPos.row >= gridSize || targetPos.col < 0 || targetPos.col >= gridSize) {
    return false;
  }

  if (isPositionInPath(targetPos, currentPath)) {
    return false;
  }

  if (currentPath.length === 0) {
    return true;
  }

  const lastPos = currentPath[currentPath.length - 1];
  return isAdjacent(lastPos, targetPos);
};

export const isPathComplete = (path: Position[], gridSize: number): boolean => {
  return path.length === gridSize * gridSize;
};

export const getAvailableMoves = (
  currentPos: Position,
  path: Position[],
  gridSize: number
): Position[] => {
  const directions = [
    { row: -1, col: 0 },
    { row: 1, col: 0 },
    { row: 0, col: -1 },
    { row: 0, col: 1 },
  ];

  return directions
    .map((d) => ({ row: currentPos.row + d.row, col: currentPos.col + d.col }))
    .filter((pos) => canMoveTo(pos, path, gridSize));
};

export const isStuck = (path: Position[], gridSize: number): boolean => {
  if (path.length === 0 || isPathComplete(path, gridSize)) {
    return false;
  }

  const lastPos = path[path.length - 1];
  const availableMoves = getAvailableMoves(lastPos, path, gridSize);
  return availableMoves.length === 0;
};
