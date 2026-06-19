import { Position, isSamePosition, isAdjacent, isObstacle, getTotalFillableCells } from '../types/game';

export const isPositionInPath = (pos: Position, path: Position[]): boolean => {
  return path.some((p) => isSamePosition(p, pos));
};

export const canMoveTo = (
  targetPos: Position,
  currentPath: Position[],
  gridSize: number,
  obstacles: Position[] = []
): boolean => {
  if (targetPos.row < 0 || targetPos.row >= gridSize || targetPos.col < 0 || targetPos.col >= gridSize) {
    return false;
  }

  if (isObstacle(targetPos, obstacles)) {
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

export const isPathComplete = (
  path: Position[],
  gridSize: number,
  obstacles: Position[] = []
): boolean => {
  const totalFillable = getTotalFillableCells(gridSize, obstacles);
  return path.length === totalFillable;
};

export const getAvailableMoves = (
  currentPos: Position,
  path: Position[],
  gridSize: number,
  obstacles: Position[] = []
): Position[] => {
  const directions = [
    { row: -1, col: 0 },
    { row: 1, col: 0 },
    { row: 0, col: -1 },
    { row: 0, col: 1 },
  ];

  return directions
    .map((d) => ({ row: currentPos.row + d.row, col: currentPos.col + d.col }))
    .filter((pos) => canMoveTo(pos, path, gridSize, obstacles));
};

export const isStuck = (
  path: Position[],
  gridSize: number,
  obstacles: Position[] = []
): boolean => {
  if (path.length === 0 || isPathComplete(path, gridSize, obstacles)) {
    return false;
  }

  const lastPos = path[path.length - 1];
  const availableMoves = getAvailableMoves(lastPos, path, gridSize, obstacles);
  return availableMoves.length === 0;
};
