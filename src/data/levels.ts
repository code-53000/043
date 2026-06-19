import { Level } from '../types/game';

export const levels: Level[] = [
  {
    id: 1,
    name: '初识',
    gridSize: 3,
    startPosition: { row: 0, col: 0 },
  },
  {
    id: 2,
    name: '入门',
    gridSize: 4,
    startPosition: { row: 0, col: 0 },
  },
  {
    id: 3,
    name: '进阶',
    gridSize: 4,
    startPosition: { row: 1, col: 1 },
  },
  {
    id: 4,
    name: '挑战',
    gridSize: 5,
    startPosition: { row: 0, col: 0 },
  },
  {
    id: 5,
    name: '中心',
    gridSize: 5,
    startPosition: { row: 2, col: 2 },
  },
  {
    id: 6,
    name: '探索',
    gridSize: 6,
    startPosition: { row: 0, col: 0 },
  },
  {
    id: 7,
    name: '迷宫',
    gridSize: 6,
    startPosition: { row: 2, col: 2 },
  },
  {
    id: 8,
    name: '大师',
    gridSize: 7,
    startPosition: { row: 3, col: 3 },
  },
];

export const getLevelById = (id: number): Level | undefined => {
  return levels.find((level) => level.id === id);
};

export const getTotalLevels = (): number => levels.length;
