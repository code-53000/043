import { useState, useCallback, useEffect } from 'react';
import { Position, GameStatus, Level, PlayerProgress, isSamePosition } from '../types/game';
import { canMoveTo, isPathComplete, isStuck } from '../utils/pathValidator';
import { useLocalStorage } from './useLocalStorage';
import { getTotalLevels } from '../data/levels';

const STORAGE_KEY = 'one-line-puzzle-progress';

const initialProgress: PlayerProgress = {
  unlockedLevel: 1,
  completedLevels: [],
};

export function useGameLogic(level: Level | null) {
  const [path, setPath] = useState<Position[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [gameStatus, setGameStatus] = useState<GameStatus>('idle');
  const [progress, setProgress] = useLocalStorage<PlayerProgress>(STORAGE_KEY, initialProgress);
  const [showCompletion, setShowCompletion] = useState(false);

  useEffect(() => {
    if (level) {
      resetGame();
    }
  }, [level]);

  const resetGame = useCallback(() => {
    if (level) {
      setPath([level.startPosition]);
      setGameStatus('idle');
      setIsDrawing(false);
      setShowCompletion(false);
    }
  }, [level]);

  const startDrawing = useCallback(
    (pos: Position) => {
      if (!level) return;
      if (path.length === 1 && isSamePosition(pos, level.startPosition)) {
        setIsDrawing(true);
        setGameStatus('playing');
      }
    },
    [level, path]
  );

  const moveTo = useCallback(
    (pos: Position) => {
      if (!isDrawing || !level || gameStatus === 'completed') return;

      if (canMoveTo(pos, path, level.gridSize)) {
        const newPath = [...path, pos];
        setPath(newPath);

        if (isPathComplete(newPath, level.gridSize)) {
          setGameStatus('completed');
          setIsDrawing(false);
          handleLevelComplete();
        }
      }
    },
    [isDrawing, level, path, gameStatus]
  );

  const stopDrawing = useCallback(() => {
    setIsDrawing(false);
  }, []);

  const undo = useCallback(() => {
    if (path.length > 1 && gameStatus !== 'completed') {
      setPath(path.slice(0, -1));
      setGameStatus('playing');
    }
  }, [path, gameStatus]);

  const handleLevelComplete = useCallback(() => {
    if (!level) return;

    setShowCompletion(true);

    setProgress((prev) => {
      const newCompleted = prev.completedLevels.includes(level.id)
        ? prev.completedLevels
        : [...prev.completedLevels, level.id];

      const nextLevel = level.id + 1;
      const newUnlocked = Math.min(Math.max(prev.unlockedLevel, nextLevel), getTotalLevels());

      return {
        unlockedLevel: newUnlocked,
        completedLevels: newCompleted,
      };
    });
  }, [level, setProgress]);

  const closeCompletion = useCallback(() => {
    setShowCompletion(false);
  }, []);

  const isCurrentPosition = useCallback(
    (pos: Position): boolean => {
      return path.length > 0 && isSamePosition(path[path.length - 1], pos);
    },
    [path]
  );

  const isInPath = useCallback(
    (pos: Position): boolean => {
      return path.some((p) => isSamePosition(p, pos));
    },
    [path]
  );

  const getPathIndex = useCallback(
    (pos: Position): number => {
      return path.findIndex((p) => isSamePosition(p, pos));
    },
    [path]
  );

  const isStuckNow = level ? isStuck(path, level.gridSize) : false;
  const progressPercent = level ? (path.length / (level.gridSize * level.gridSize)) * 100 : 0;

  return {
    path,
    isDrawing,
    gameStatus,
    progress,
    showCompletion,
    isStuck: isStuckNow,
    progressPercent,
    startDrawing,
    moveTo,
    stopDrawing,
    undo,
    resetGame,
    closeCompletion,
    isCurrentPosition,
    isInPath,
    getPathIndex,
    canUndo: path.length > 1 && gameStatus !== 'completed',
    canReset: path.length > 1,
  };
}
