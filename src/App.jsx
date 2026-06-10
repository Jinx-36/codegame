import React, { useState, useEffect, useRef } from 'react';
import { levels } from './levels';
import GameEngine from './components/GameEngine';
import CommandBlocks from './components/CommandBlocks';

function App() {
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const currentLevel = levels[currentLevelIndex];

  const [playerPos, setPlayerPos] = useState({ ...currentLevel.startPos });
  const [playerFacing, setPlayerFacing] = useState(currentLevel.startPos.facing);

  const [commands, setCommands] = useState([]);
  const [gameState, setGameState] = useState('IDLE'); // IDLE, RUNNING, WON, LOST
  const [modalMessage, setModalMessage] = useState('');

  // Auth & Timer State
  const [user, setUser] = useState(null);
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes in seconds
  const [isGameOver, setIsGameOver] = useState(false);
  const [finalStats, setFinalStats] = useState(null);

  // Form State
  const [formName, setFormName] = useState('');
  const [formMatricule, setFormMatricule] = useState('');
  const [formError, setFormError] = useState('');

  // End game handler
  const triggerGameOver = async (completedLevel) => {
    setIsGameOver(true);
    setGameState('IDLE');

    const timeUsed = 1800 - timeLeft;
    setFinalStats({ maxLevel: completedLevel, timeUsed });

    try {
      await fetch('http://localhost:3001/api/save-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          matricule: user.matricule,
          name: user.name,
          maxLevel: completedLevel,
          timeUsed: timeUsed
        })
      });
    } catch (err) {
      console.error('Failed to save session:', err);
    }
  };

  // Timer logic
  useEffect(() => {
    if (user && !isGameOver) {
      if (timeLeft <= 0) {
        triggerGameOver(currentLevelIndex + 1); // Trigger game over with current level
      } else {
        const timerId = setInterval(() => {
          setTimeLeft((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(timerId);
      }
    }
  }, [user, isGameOver, timeLeft]);

  // Reset level state when level changes
  useEffect(() => {
    setPlayerPos({ x: currentLevel.startPos.x, y: currentLevel.startPos.y });
    setPlayerFacing(currentLevel.startPos.facing);
    setCommands([]);
    setGameState('IDLE');
    setModalMessage('');
  }, [currentLevelIndex, currentLevel]);

  const handleRunCode = () => {
    if (gameState === 'RUNNING') return;

    // Reset player position before running
    setPlayerPos({ x: currentLevel.startPos.x, y: currentLevel.startPos.y });
    setPlayerFacing(currentLevel.startPos.facing);
    setGameState('RUNNING');

    if (commands.length === 0) {
      setGameState('LOST');
      setModalMessage("You didn't add any commands!");
      return;
    }

    // Unroll loops into a flat array of simple actions
    const unrollCommands = (cmds) => {
      const flat = [];
      let i = 0;
      while (i < cmds.length) {
        const cmd = cmds[i];
        if (cmd.type === 'START_LOOP') {
          // Find matching END_LOOP
          let endIdx = -1;
          let depth = 0;
          for (let j = i + 1; j < cmds.length; j++) {
            if (cmds[j].type === 'START_LOOP') depth++;
            if (cmds[j].type === 'END_LOOP') {
              if (depth === 0) {
                endIdx = j;
                break;
              } else {
                depth--;
              }
            }
          }

          if (endIdx !== -1) {
            // We found a loop block
            const innerLoop = cmds.slice(i + 1, endIdx);
            const unrolledInner = unrollCommands(innerLoop); // recursively unroll
            for (let iter = 0; iter < cmd.iterations; iter++) {
              flat.push(...unrolledInner);
            }
            i = endIdx + 1; // Skip past the END_LOOP
          } else {
            // Malformed loop (no end), just treat contents normally
            i++;
          }
        } else if (cmd.type !== 'END_LOOP') {
          // Normal command
          flat.push(cmd.type);
          i++;
        } else {
          // Stray END_LOOP, ignore
          i++;
        }
      }
      return flat;
    };

    const flatActions = unrollCommands(commands);

    if (flatActions.length === 0) {
      setGameState('LOST');
      setModalMessage("Your sequence didn't result in any actions!");
      return;
    }

    // Need refs to hold current state during the timeout closures
    let currentX = currentLevel.startPos.x;
    let currentY = currentLevel.startPos.y;
    let currentDir = currentLevel.startPos.facing;

    const executeAction = (index) => {
      if (index >= flatActions.length) {
        // End of actions - evaluate win/loss now
        setTimeout(() => {
          if (currentX === currentLevel.goalPos.x && currentY === currentLevel.goalPos.y) {
            if (currentLevelIndex === levels.length - 1) {
              triggerGameOver(20);
            } else {
              setGameState('WON');
              setModalMessage("Great job! You wrote the correct sequence.");
            }
          } else {
            setGameState('LOST');
            setModalMessage("You ran out of commands before reaching the goal.");
          }
        }, 500);
        return;
      }

      const action = flatActions[index];

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
          return; // Stop executing immediately
        }

        // Collision Check: Walls
        const hitWall = currentLevel.walls.some(w => w.x === nextX && w.y === nextY);
        if (hitWall) {
          setGameState('LOST');
          setModalMessage("Ouch! You hit a wall.");
          return; // Stop executing immediately
        }

        currentX = nextX;
        currentY = nextY;
        setPlayerPos({ x: currentX, y: currentY });
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

  const handleRegister = (e) => {
    e.preventDefault();
    if (!/^[a-zA-Z0-9]{6}$/.test(formMatricule)) {
      setFormError('Matricule must be exactly 6 alphanumeric characters.');
      return;
    }
    if (formName.trim() === '') {
      setFormError('Name is required.');
      return;
    }
    setUser({ name: formName, matricule: formMatricule });
  };

  if (!user) {
    return (
      <div className="flex w-screen h-screen items-center justify-center bg-game-dark-blue font-sans">
        <form onSubmit={handleRegister} className="bg-game-white p-8 rounded-xl shadow-2xl max-w-md w-full">
          <h2 className="text-3xl font-bold mb-6 text-game-dark-blue text-center">Registration</h2>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
            <input
              type="text"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-game-light-blue"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="Enter your name"
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">Matricule (6 chars)</label>
            <input
              type="text"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-game-light-blue"
              value={formMatricule}
              onChange={(e) => setFormMatricule(e.target.value.toUpperCase())}
              placeholder="e.g. AB1234"
              maxLength={6}
            />
            {formError && <p className="text-red-500 text-xs italic mt-2">{formError}</p>}
          </div>

          <div className="flex items-center justify-between">
            <button className="bg-game-light-blue hover:bg-opacity-90 text-game-dark-blue font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 w-full" type="submit">
              Start Game
            </button>
          </div>
        </form>
      </div>
    );
  }

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="flex w-screen h-screen overflow-hidden font-sans relative">
      {/* Timer UI */}
      <div className="absolute top-4 right-4 bg-game-dark-blue text-game-white px-4 py-2 rounded-lg shadow-lg z-20 font-mono text-xl font-bold border-2 border-game-light-blue">
        {formatTime(timeLeft)}
      </div>

      {/* Left Panel: Command Blocks */}
      <div className="w-1/3 h-full min-w-[400px]">
        <CommandBlocks
          levelInstructions={currentLevel.instructions}
          levelNumber={currentLevel.id}
          maxCommands={currentLevel.maxCommands}
          commands={commands}
          setCommands={setCommands}
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
        {(gameState === 'WON' || gameState === 'LOST' || isGameOver) && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30">
            <div className="bg-game-white p-8 rounded-xl shadow-2xl max-w-md text-center">
              {isGameOver ? (
                <>
                  <h2 className="text-4xl font-bold mb-4 text-game-dark-blue">Session Complete!</h2>
                  <div className="text-gray-700 mb-8 text-lg space-y-2">
                    <p><strong>Name:</strong> {user.name}</p>
                    <p><strong>Matricule:</strong> {user.matricule}</p>
                    <p><strong>Max Level Reached:</strong> {finalStats?.maxLevel}</p>
                    <p><strong>Time Used:</strong> {formatTime(finalStats?.timeUsed)}</p>
                  </div>
                  <p className="text-sm opacity-75 italic text-gray-600">Your results have been saved.</p>
                </>
              ) : (
                <>
                  <h2 className={`text-3xl font-bold mb-4 ${gameState === 'WON' ? 'text-green-600' : 'text-red-600'}`}>
                    {gameState === 'WON' ? 'Level Complete!' : 'Try Again'}
                  </h2>
                  <p className="text-gray-700 mb-8 text-lg">{modalMessage}</p>

                  {gameState === 'WON' ? (
                    <button
                      onClick={handleNextLevel}
                      className="bg-game-light-blue text-game-dark-blue px-6 py-2 rounded-lg font-bold text-lg hover:bg-opacity-90 transition-all"
                    >
                      Next Level
                    </button>
                  ) : (
                    <button
                      onClick={handleRetry}
                      className="bg-gray-800 text-game-white px-6 py-2 rounded-lg font-bold text-lg hover:bg-opacity-90 transition-all"
                    >
                      Retry
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
