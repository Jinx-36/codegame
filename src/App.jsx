import React, { useState, useEffect, useRef } from 'react';
import { levels } from './levels';
import { parseCommands } from './utils/parser';
import GameEngine from './components/GameEngine';
import CodeEditor from './components/CodeEditor';

function App() {
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const currentLevel = levels[currentLevelIndex];

  const [playerPos, setPlayerPos] = useState({ ...currentLevel.startPos });
  const [playerFacing, setPlayerFacing] = useState(currentLevel.startPos.facing);

  const [code, setCode] = useState('');
  const [gameState, setGameState] = useState('IDLE'); // IDLE, RUNNING, WON, LOST
  const [modalMessage, setModalMessage] = useState('');

  // Reset level state when level changes
  useEffect(() => {
    setPlayerPos({ x: currentLevel.startPos.x, y: currentLevel.startPos.y });
    setPlayerFacing(currentLevel.startPos.facing);
    setCode('');
    setGameState('IDLE');
    setModalMessage('');
  }, [currentLevelIndex, currentLevel]);

  const handleRunCode = () => {
    if (gameState === 'RUNNING') return;

    // Reset player position before running
    setPlayerPos({ x: currentLevel.startPos.x, y: currentLevel.startPos.y });
    setPlayerFacing(currentLevel.startPos.facing);
    setGameState('RUNNING');

    const actions = parseCommands(code);
    if (actions.length === 0) {
      setGameState('LOST');
      setModalMessage("You didn't write any valid commands!");
      return;
    }

    // Need refs to hold current state during the timeout closures
    let currentX = currentLevel.startPos.x;
    let currentY = currentLevel.startPos.y;
    let currentDir = currentLevel.startPos.facing;

    const executeAction = (index) => {
      if (index >= actions.length) {
        // End of actions
        return;
      }

      const action = actions[index];

      if (action === 'TURN_LEFT') {
        const dirs = ['NORTH', 'WEST', 'SOUTH', 'EAST'];
        currentDir = dirs[(dirs.indexOf(currentDir) + 1) % 4];
        setPlayerFacing(currentDir);
      } else if (action === 'TURN_RIGHT') {
        const dirs = ['NORTH', 'EAST', 'SOUTH', 'WEST'];
        currentDir = dirs[(dirs.indexOf(currentDir) + 1) % 4];
        setPlayerFacing(currentDir);
      } else if (action === 'MOVE_FORWARD') {
        let nextX = currentX;
        let nextY = currentY;

        if (currentDir === 'NORTH') nextY -= 1;
        else if (currentDir === 'EAST') nextX += 1;
        else if (currentDir === 'SOUTH') nextY += 1;
        else if (currentDir === 'WEST') nextX -= 1;

        // Collision Check: Bounds
        if (nextX < 0 || nextX >= currentLevel.gridSize || nextY < 0 || nextY >= currentLevel.gridSize) {
          setPlayerPos({ x: nextX, y: nextY }); // Let them see the fall
          setGameState('LOST');
          setModalMessage("Oh no! You went out of bounds.");
          return; // Stop executing
        }

        // Collision Check: Walls
        const hitWall = currentLevel.walls.some(w => w.x === nextX && w.y === nextY);
        if (hitWall) {
          setGameState('LOST');
          setModalMessage("Ouch! You hit a wall.");
          return; // Stop executing
        }

        currentX = nextX;
        currentY = nextY;
        setPlayerPos({ x: currentX, y: currentY });
      }

      // Check Win Condition
      if (currentX === currentLevel.goalPos.x && currentY === currentLevel.goalPos.y) {
        setGameState('WON');
        setModalMessage("Great job! You wrote the correct code.");
        return; // Stop executing
      }

      // If we finished all commands and haven't won/lost yet
      if (index === actions.length - 1 && !(currentX === currentLevel.goalPos.x && currentY === currentLevel.goalPos.y)) {
        setTimeout(() => {
          if (gameState !== 'LOST' && gameState !== 'WON') { // Prevent double-triggering
            setGameState('LOST');
            setModalMessage("You ran out of commands before reaching the goal.");
          }
        }, 500);
      }

      setTimeout(() => executeAction(index + 1), 500);
    };

    setTimeout(() => executeAction(0), 500); // Initial delay before starting
  };

  const handleNextLevel = () => {
    if (currentLevelIndex < levels.length - 1) {
      setCurrentLevelIndex(currentLevelIndex + 1);
    }
  };

  const handleRetry = () => {
    setPlayerPos({ x: currentLevel.startPos.x, y: currentLevel.startPos.y });
    setPlayerFacing(currentLevel.startPos.facing);
    setGameState('IDLE');
    setModalMessage('');
  };

  return (
    <div className="flex w-screen h-screen overflow-hidden font-sans">
      {/* Left Panel: Code Editor */}
      <div className="w-1/3 h-full min-w-[400px]">
        <CodeEditor
          levelInstructions={currentLevel.instructions}
          levelNumber={currentLevel.id}
          code={code}
          setCode={setCode}
          onRunCode={handleRunCode}
          gameState={gameState}
        />
      </div>

      {/* Right Panel: Game Engine */}
      <div className="flex-grow h-full relative">
        <GameEngine
          level={currentLevel}
          playerPos={playerPos}
          playerFacing={playerFacing}
        />

        {/* Modal Overlay */}
        {(gameState === 'WON' || gameState === 'LOST') && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
            <div className="bg-game-white p-8 rounded-xl shadow-2xl max-w-md text-center">
              <h2 className={`text-3xl font-bold mb-4 ${gameState === 'WON' ? 'text-green-600' : 'text-red-600'}`}>
                {gameState === 'WON' ? 'Level Complete!' : 'Try Again'}
              </h2>
              <p className="text-gray-700 mb-8 text-lg">{modalMessage}</p>

              {gameState === 'WON' ? (
                <button
                  onClick={handleNextLevel}
                  className="bg-game-light-blue text-game-dark-blue px-6 py-2 rounded-lg font-bold text-lg hover:bg-opacity-90 transition-all"
                >
                  {currentLevelIndex < levels.length - 1 ? 'Next Level' : 'Finish Game'}
                </button>
              ) : (
                <button
                  onClick={handleRetry}
                  className="bg-gray-800 text-game-white px-6 py-2 rounded-lg font-bold text-lg hover:bg-opacity-90 transition-all"
                >
                  Retry
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
