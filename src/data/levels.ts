import { Level } from '../types/game';
import { checkSolvability } from '../utils/solvabilityChecker';

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
    obstacles: [
      { row: 2, col: 2 },
    ],
  },
  {
    id: 4,
    name: '挑战',
    gridSize: 5,
    startPosition: { row: 0, col: 0 },
    obstacles: [
      { row: 1, col: 2 },
    ],
  },
  {
    id: 5,
    name: '中心',
    gridSize: 5,
    startPosition: { row: 0, col: 2 },
    obstacles: [
      { row: 2, col: 0 },
      { row: 2, col: 4 },
    ],
  },
  {
    id: 6,
    name: '探索',
    gridSize: 6,
    startPosition: { row: 0, col: 0 },
    obstacles: [
      { row: 2, col: 3 },
      { row: 3, col: 2 },
    ],
  },
  {
    id: 7,
    name: '迷宫',
    gridSize: 6,
    startPosition: { row: 0, col: 0 },
    obstacles: [
      { row: 1, col: 2 },
      { row: 2, col: 4 },
      { row: 3, col: 1 },
      { row: 4, col: 3 },
    ],
  },
  {
    id: 8,
    name: '大师',
    gridSize: 7,
    startPosition: { row: 0, col: 0 },
    obstacles: [
      { row: 1, col: 2 },
      { row: 2, col: 4 },
      { row: 3, col: 1 },
      { row: 4, col: 3 },
      { row: 5, col: 5 },
    ],
  },
];

export const validateLevelsOnLoad = (): {
  allValid: boolean;
  results: { levelId: number; solvable: boolean; timeMs: number }[];
} => {
  const results = levels.map((level) => {
    const result = checkSolvability(level, 10000);
    if (!result.solvable) {
      console.error(
        `[关卡校验] 第 ${level.id} 关 [${level.name}] 校验失败！该关卡不可解，请调整障碍格配置。`
      );
    } else {
      console.info(
        `[关卡校验] 第 ${level.id} 关 [${level.name}] 校验通过 ✓ (${result.timeMs.toFixed(2)}ms, ${result.visitedCount.toLocaleString()} 节点)`
      );
    }
    return {
      levelId: level.id,
      solvable: result.solvable,
      timeMs: result.timeMs,
    };
  });

  const allValid = results.every((r) => r.solvable);

  if (allValid) {
    console.info(`[关卡校验] 全部 ${levels.length} 个关卡校验通过！`);
  } else {
    const failedCount = results.filter((r) => !r.solvable).length;
    console.error(`[关卡校验] 有 ${failedCount} 个关卡校验未通过！`);
  }

  return { allValid, results };
};

let validationPerformed = false;
let cachedAllValid = true;

export const ensureLevelsValidated = (): boolean => {
  if (!validationPerformed) {
    const { allValid } = validateLevelsOnLoad();
    cachedAllValid = allValid;
    validationPerformed = true;
  }
  return cachedAllValid;
};

if (typeof window !== 'undefined') {
  ensureLevelsValidated();
}

export const getValidLevels = (): Level[] => {
  ensureLevelsValidated();
  const validLevelIds = new Set(
    levels
      .filter((level) => checkSolvability(level).solvable)
      .map((level) => level.id)
  );
  return levels.filter((level) => validLevelIds.has(level.id));
};

export const getLevelById = (id: number): Level | undefined => {
  const level = levels.find((level) => level.id === id);
  if (level) {
    const { solvable } = checkSolvability(level);
    if (!solvable) {
      console.warn(
        `[关卡校验] 警告：尝试加载的第 ${id} 关 [${level.name}] 不可解！`
      );
      return undefined;
    }
  }
  return level;
};

export const getTotalLevels = (): number => getValidLevels().length;
