import { useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Level, ViewMode, getTotalFillableCells } from './types/game';
import { useGameLogic } from './hooks/useGameLogic';
import { LevelSelect } from './components/LevelSelect';
import { GameGrid } from './components/GameGrid';
import { ControlPanel } from './components/ControlPanel';
import { CompletionModal } from './components/CompletionModal';
import { getLevelById, getTotalLevels, ensureLevelsValidated } from './data/levels';
import { isLevelSolvable } from './utils/solvabilityChecker';

export default function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('select');
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);
  const [levelError, setLevelError] = useState<string | null>(null);

  const gameLogic = useGameLogic(selectedLevel);

  const handleSelectLevel = useCallback((level: Level) => {
    ensureLevelsValidated();

    if (!isLevelSolvable(level)) {
      setLevelError(
        `第 ${level.id} 关 [${level.name}] 配置存在问题，无法生成可解路径，请选择其他关卡。`
      );
      setTimeout(() => setLevelError(null), 3000);
      return;
    }

    setSelectedLevel(level);
    setViewMode('game');
    setLevelError(null);
  }, []);

  const handleBackToSelect = useCallback(() => {
    gameLogic.closeCompletion();
    setViewMode('select');
    setSelectedLevel(null);
  }, [gameLogic]);

  const handleNextLevel = useCallback(() => {
    if (!selectedLevel) return;
    const nextLevelId = selectedLevel.id + 1;
    const nextLevel = getLevelById(nextLevelId);
    if (nextLevel) {
      setSelectedLevel(nextLevel);
      gameLogic.closeCompletion();
    }
  }, [selectedLevel, gameLogic]);

  const isLastLevel = selectedLevel ? selectedLevel.id >= getTotalLevels() : true;
  const obstacleCount = selectedLevel?.obstacles?.length || 0;
  const totalFillable = selectedLevel ? getTotalFillableCells(selectedLevel.gridSize, selectedLevel.obstacles) : 0;

  return (
    <div className="w-full max-w-4xl mx-auto bg-grid-pattern">
      {levelError && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-6 py-3 bg-red-500 text-white rounded-xl shadow-lg animate-bounce">
          ⚠️ {levelError}
        </div>
      )}

      <AnimatePresence mode="wait">
        {viewMode === 'select' && (
          <LevelSelect
            key="level-select"
            progress={gameLogic.progress}
            onSelectLevel={handleSelectLevel}
          />
        )}

        {viewMode === 'game' && selectedLevel && (
          <div key="game-view" className="w-full">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-1">
                第 {selectedLevel.id} 关 · {selectedLevel.name}
              </h2>
              <p className="text-gray-500 text-sm">
                {selectedLevel.gridSize}×{selectedLevel.gridSize} 网格
                {obstacleCount > 0 && ` · ${obstacleCount} 个障碍 · ${totalFillable} 格可填`}
              </p>
              <div className="mt-3 w-64 mx-auto h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary-400 to-accent-500 transition-all duration-300 ease-out"
                  style={{ width: `${gameLogic.progressPercent}%` }}
                />
              </div>
            </div>

            <GameGrid
              level={selectedLevel}
              path={gameLogic.path}
              isDrawing={gameLogic.isDrawing}
              gameStatus={gameLogic.gameStatus}
              totalFillableCells={gameLogic.totalFillableCells}
              onStartDrawing={gameLogic.startDrawing}
              onMoveTo={gameLogic.moveTo}
              onStopDrawing={gameLogic.stopDrawing}
              isCurrentPosition={gameLogic.isCurrentPosition}
              isInPath={gameLogic.isInPath}
              isObstacleCell={gameLogic.isObstacleCell}
              getPathIndex={gameLogic.getPathIndex}
              isStuck={gameLogic.isStuck}
            />

            <ControlPanel
              canUndo={gameLogic.canUndo}
              canReset={gameLogic.canReset}
              onUndo={gameLogic.undo}
              onReset={gameLogic.resetGame}
              onBack={handleBackToSelect}
              isStuck={gameLogic.isStuck}
            />
          </div>
        )}
      </AnimatePresence>

      <CompletionModal
        isOpen={gameLogic.showCompletion}
        currentLevelId={selectedLevel?.id || 0}
        onNextLevel={handleNextLevel}
        onBackToSelect={handleBackToSelect}
        onClose={gameLogic.closeCompletion}
      />

      <div className="mt-12 text-center text-xs text-gray-400">
        <p>按住起点拖动鼠标，一笔填满所有可填格子</p>
        <p className="mt-1">只能上下左右移动，不能重复经过格子，不能进入障碍格</p>
      </div>
    </div>
  );
}
