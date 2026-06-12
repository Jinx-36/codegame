import React from 'react';

const CommandBlocks = ({ levelInstructions, levelNumber, maxCommands, commands, setCommands, onRunCode, gameState }) => {

  const handleAddCommand = (cmd) => {
    if (gameState === 'RUNNING') return;
    if (commands.length < maxCommands) {
      setCommands([...commands, cmd]);
    }
  };

  const handleRemoveCommand = (index) => {
    if (gameState === 'RUNNING') return;
    const newCommands = [...commands];
    newCommands.splice(index, 1);
    setCommands(newCommands);
  };

  const updateCommand = (index, delta) => {
    if (gameState === 'RUNNING') return;
    const newCommands = [...commands];
    const newIterations = newCommands[index].iterations + delta;
    if (newIterations >= 2 && newIterations <= 5) {
      newCommands[index].iterations = newIterations;
      setCommands(newCommands);
    }
  };

  const commandIcons = {
    'MOVE_FORWARD': '⬆️',
    'TURN_LEFT': '⬅️',
    'TURN_RIGHT': '➡️',
    'START_LOOP': '🔁',
    'END_LOOP': '🔚',
    'TRANSMIT': '⚡'
  };

  return (
    <div className="w-full h-full bg-game-dark-blue text-game-white p-8 flex flex-col shadow-xl">
      <div className="mb-6">
        <h2 className="text-3xl font-bold mb-2 text-game-light-blue">Level {levelNumber}</h2>
        <p className="text-lg opacity-90">{levelInstructions}</p>
        <p className="text-sm mt-2 opacity-70">Commands used: {commands.length} / {maxCommands}</p>
      </div>

      <div className="flex-grow flex flex-col gap-6">
        {/* Command Slots */}
        <div className="bg-[#1e253c] p-4 rounded-lg shadow-inner flex flex-wrap gap-2 content-start overflow-y-auto max-h-[40vh]">
          {Array.from({ length: maxCommands }).map((_, index) => {
            const isFilled = index < commands.length;
            const cmd = commands[index];
            return (
              <div
                key={index}
                className={`relative w-12 h-12 flex flex-col items-center justify-center rounded-md border-2
                  ${isFilled
                    ? 'border-game-light-blue bg-game-light-blue bg-opacity-20 cursor-pointer hover:bg-opacity-40'
                    : 'border-dashed border-gray-600 cursor-default'
                  } transition-colors select-none`}
                title={isFilled ? "Click to remove" : ""}
                onClick={(e) => {
                  // Prevent removing if clicking on the + / - buttons
                  if (e.target.tagName !== 'BUTTON' && isFilled) {
                    handleRemoveCommand(index);
                  }
                }}
              >
                {isFilled && (
                  <>
                    <span className="text-2xl pointer-events-none">{commandIcons[cmd.type]}</span>
                    {cmd.type === 'START_LOOP' && (
                      <div className="absolute -top-2 -right-2 bg-game-dark-blue border border-game-light-blue text-xs rounded px-1 flex items-center z-10" onClick={e => e.stopPropagation()}>
                        <button className="px-1 hover:text-game-light-blue disabled:opacity-50" onClick={() => updateCommand(index, -1)} disabled={cmd.iterations <= 2 || gameState === 'RUNNING'}>-</button>
                        <span className="font-bold">{cmd.iterations}</span>
                        <button className="px-1 hover:text-game-light-blue disabled:opacity-50" onClick={() => updateCommand(index, 1)} disabled={cmd.iterations >= 5 || gameState === 'RUNNING'}>+</button>
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>

        {/* Available Commands */}
        <div>
          <h3 className="text-lg mb-3 opacity-80">Available Actions:</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleAddCommand({ type: 'MOVE_FORWARD' })}
              disabled={gameState === 'RUNNING' || commands.length >= maxCommands}
              className="w-16 h-16 flex flex-col items-center justify-center bg-gray-700 rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <span className="text-2xl mb-1">⬆️</span>
              <span className="text-[10px] font-bold">Forward</span>
            </button>
            <button
              onClick={() => handleAddCommand({ type: 'TURN_LEFT' })}
              disabled={gameState === 'RUNNING' || commands.length >= maxCommands}
              className="w-16 h-16 flex flex-col items-center justify-center bg-gray-700 rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <span className="text-2xl mb-1">⬅️</span>
              <span className="text-[10px] font-bold">Left</span>
            </button>
            <button
              onClick={() => handleAddCommand({ type: 'TURN_RIGHT' })}
              disabled={gameState === 'RUNNING' || commands.length >= maxCommands}
              className="w-16 h-16 flex flex-col items-center justify-center bg-gray-700 rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <span className="text-2xl mb-1">➡️</span>
              <span className="text-[10px] font-bold">Right</span>
            </button>
            <button
              onClick={() => handleAddCommand({ type: 'START_LOOP', iterations: 2 })}
              disabled={gameState === 'RUNNING' || commands.length >= maxCommands}
              className="w-16 h-16 flex flex-col items-center justify-center bg-gray-700 rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <span className="text-2xl mb-1">🔁</span>
              <span className="text-[10px] font-bold">Start Loop</span>
            </button>
            <button
              onClick={() => handleAddCommand({ type: 'END_LOOP' })}
              disabled={gameState === 'RUNNING' || commands.length >= maxCommands}
              className="w-16 h-16 flex flex-col items-center justify-center bg-gray-700 rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <span className="text-2xl mb-1">🔚</span>
              <span className="text-[10px] font-bold">End Loop</span>
            </button>
            <button
              onClick={() => handleAddCommand({ type: 'TRANSMIT' })}
              disabled={gameState === 'RUNNING' || commands.length >= maxCommands}
              className="w-16 h-16 flex flex-col items-center justify-center bg-gray-700 rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <span className="text-2xl mb-1">⚡</span>
              <span className="text-[10px] font-bold">Transmit</span>
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          className={`px-8 py-3 rounded-lg font-bold text-lg shadow-md transition-all
            ${gameState === 'RUNNING'
              ? 'bg-gray-500 text-gray-300 cursor-not-allowed'
              : 'bg-game-light-blue text-game-dark-blue hover:bg-opacity-90 hover:shadow-lg active:transform active:scale-95'
            }`}
          onClick={onRunCode}
          disabled={gameState === 'RUNNING' || commands.length === 0}
        >
          {gameState === 'RUNNING' ? 'Running...' : 'Run Sequence'}
        </button>
      </div>
    </div>
  );
};

export default CommandBlocks;
