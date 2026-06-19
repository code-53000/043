import { Position, Level, isObstacle, getTotalFillableCells } from '../types/game';

interface SolvabilityResult {
  solvable: boolean;
  solution?: Position[];
  visitedCount: number;
  timeMs: number;
}

const posKey = (pos: Position): number => pos.row * 1000 + pos.col;

const getNeighbors = (
  pos: Position,
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
    .map((d) => ({ row: pos.row + d.row, col: pos.col + d.col }))
    .filter(
      (p) =>
        p.row >= 0 &&
        p.row < gridSize &&
        p.col >= 0 &&
        p.col < gridSize &&
        !isObstacle(p, obstacles)
    );
};

const getUnvisitedNeighbors = (
  pos: Position,
  gridSize: number,
  visited: Set<number>,
  obstacles: Position[] = []
): Position[] => {
  return getNeighbors(pos, gridSize, obstacles).filter(
    (p) => !visited.has(posKey(p))
  );
};

const countUnreachableCells = (
  start: Position,
  gridSize: number,
  visited: Set<number>,
  obstacles: Position[] = []
): number => {
  const queue: Position[] = [start];
  const localVisited = new Set<number>();
  localVisited.add(posKey(start));

  let count = 0;
  while (queue.length > 0) {
    const current = queue.shift()!;
    count++;
    const neighbors = getNeighbors(current, gridSize, obstacles);
    for (const n of neighbors) {
      const k = posKey(n);
      if (!localVisited.has(k) && !visited.has(k)) {
        localVisited.add(k);
        queue.push(n);
      }
    }
  }
  return count;
};

export const checkSolvability = (
  level: Level,
  timeoutMs: number = 5000
): SolvabilityResult => {
  const startTime = performance.now();
  const { gridSize, startPosition, obstacles = [] } = level;
  const totalFillable = getTotalFillableCells(gridSize, obstacles);

  if (isObstacle(startPosition, obstacles)) {
    return {
      solvable: false,
      visitedCount: 0,
      timeMs: performance.now() - startTime,
    };
  }

  let visitedCount = 0;
  let timedOut = false;

  const visited = new Set<number>();
  visited.add(posKey(startPosition));
  const path: Position[] = [startPosition];

  const backtrack = (current: Position): boolean => {
    visitedCount++;

    if (performance.now() - startTime > timeoutMs) {
      timedOut = true;
      return false;
    }

    if (path.length === totalFillable) {
      return true;
    }

    const remaining = totalFillable - path.length;
    const reachable = countUnreachableCells(current, gridSize, visited, obstacles);
    if (reachable < remaining) {
      return false;
    }

    const unvisitedNeighbors = getUnvisitedNeighbors(current, gridSize, visited, obstacles);

    const sortedNeighbors = [...unvisitedNeighbors].sort((a, b) => {
      const aCount = getUnvisitedNeighbors(a, gridSize, visited, obstacles).length;
      const bCount = getUnvisitedNeighbors(b, gridSize, visited, obstacles).length;
      return aCount - bCount;
    });

    for (const next of sortedNeighbors) {
      const nextKey = posKey(next);
      visited.add(nextKey);
      path.push(next);

      if (backtrack(next)) {
        return true;
      }

      visited.delete(nextKey);
      path.pop();

      if (timedOut) {
        return false;
      }
    }

    return false;
  };

  const solvable = backtrack(startPosition);

  return {
    solvable,
    solution: solvable ? [...path] : undefined,
    visitedCount,
    timeMs: performance.now() - startTime,
  };
};

export const validateAllLevels = (
  levels: Level[]
): { levelId: number; result: SolvabilityResult }[] => {
  return levels.map((level) => ({
    levelId: level.id,
    result: checkSolvability(level),
  }));
};

export const isLevelSolvable = (level: Level): boolean => {
  return checkSolvability(level).solvable;
};
