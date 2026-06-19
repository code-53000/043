import React, { useCallback, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Level, Position, isSamePosition } from '../types/game';
import { GameCell } from './GameCell';
import { getAvailableMoves } from '../utils/pathValidator';

interface GameGridProps {
  level: Level;
  path: Position[];
  isDrawing: boolean;
  gameStatus: string;
  onStartDrawing: (pos: Position) => void;
  onMoveTo: (pos: Position) => void;
  onStopDrawing: () => void;
  isCurrentPosition: (pos: Position) => boolean;
  isInPath: (pos: Position) => boolean;
  getPathIndex: (pos: Position) => number;
  isStuck: boolean;
}

export const GameGrid: React.FC<GameGridProps> = ({
  level,
  path,
  isDrawing,
  gameStatus,
  onStartDrawing,
  onMoveTo,
  onStopDrawing,
  isCurrentPosition,
  isInPath,
  getPathIndex,
  isStuck,
}) => {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseUp = () => {
      onStopDrawing();
    };

    window.addEventListener('mouseup', handleMouseUp);
    return () => window.removeEventListener('mouseup', handleMouseUp);
  }, [onStopDrawing]);

  const renderGrid = useCallback(() => {
    const cells = [];
    const isCompleted = gameStatus === 'completed';

    for (let row = 0; row < level.gridSize; row++) {
      for (let col = 0; col < level.gridSize; col++) {
        const pos = { row, col };
        const isStart = isSamePosition(pos, level.startPosition);

        cells.push(
          <GameCell
            key={`${row}-${col}`}
            position={pos}
            isStart={isStart}
            isInPath={isInPath(pos)}
            isCurrent={isCurrentPosition(pos)}
            pathIndex={getPathIndex(pos)}
            gridSize={level.gridSize}
            onMouseDown={onStartDrawing}
            onMouseEnter={onMoveTo}
            isCompleted={isCompleted}
          />
        );
      }
    }
    return cells;
  }, [level, isInPath, isCurrentPosition, getPathIndex, onStartDrawing, onMoveTo, gameStatus]);

  const isCompleted = gameStatus === 'completed';

  const hint = isStuck
    ? '走不通了，试试撤销或重置吧'
    : path.length === 1
    ? '按住起点，拖动鼠标开始画线'
    : isDrawing
    ? '继续拖动...'
    : isCompleted
    ? '太棒了！'
    : '';

  const availableMoves =
    path.length > 0 && !isCompleted
      ? getAvailableMoves(path[path.length - 1], path, level.gridSize).length
      : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col items-center gap-6"
    >
      <div className="text-center">
        <p className="text-gray-500 text-sm mb-1">{hint}</p>
        {path.length > 1 && !isCompleted && (
          <p className="text-xs text-gray-400">
            已填 {path.length} / {level.gridSize * level.gridSize} 格
            {availableMoves > 0 && ` · 还有 ${availableMoves} 个方向可走`}
          </p>
        )}
      </div>

      <div
        ref={gridRef}
        className="relative p-4 bg-gray-50 rounded-2xl shadow-inner"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${level.gridSize}, 1fr)`,
          gap: '8px',
        }}
        onMouseLeave={() => {
          if (isDrawing) {
            onStopDrawing();
          }
        }}
      >
        {renderGrid()}
      </div>
    </motion.div>
  );
};
