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

  const commandIcons = {
    'MOVE_FORWARD': '⬆️',
    'TURN_LEFT': '⬅️',
    'TURN_RIGHT': '➡️'
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
            return (
              <div
                key={index}
                onClick={() => isFilled ? handleRemoveCommand(index) : null}
                className={`w-12 h-12 flex items-center justify-center rounded-md border-2
                  ${isFilled
                    ? 'border-game-light-blue bg-game-light-blue bg-opacity-20 cursor-pointer hover:bg-opacity-40'
                    : 'border-dashed border-gray-600 cursor-default'
                  } transition-colors`}
                title={isFilled ? "Click to remove" : ""}
              >
                {isFilled && <span className="text-2xl">{commandIcons[commands[index]]}</span>}
              </div>
            );
          })}
        </div>

        {/* Available Commands */}
        <div>
          <h3 className="text-lg mb-3 opacity-80">Available Actions:</h3>
          <div className="flex gap-4">
            <button
              onClick={() => handleAddCommand('MOVE_FORWARD')}
              disabled={gameState === 'RUNNING' || commands.length >= maxCommands}
              className="flex-1 flex flex-col items-center justify-center py-4 bg-gray-700 rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <span className="text-3xl mb-1">⬆️</span>
              <span className="text-xs font-bold">Forward</span>
            </button>
            <button
              onClick={() => handleAddCommand('TURN_LEFT')}
              disabled={gameState === 'RUNNING' || commands.length >= maxCommands}
              className="flex-1 flex flex-col items-center justify-center py-4 bg-gray-700 rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <span className="text-3xl mb-1">⬅️</span>
              <span className="text-xs font-bold">Left</span>
            </button>
            <button
              onClick={() => handleAddCommand('TURN_RIGHT')}
              disabled={gameState === 'RUNNING' || commands.length >= maxCommands}
              className="flex-1 flex flex-col items-center justify-center py-4 bg-gray-700 rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <span className="text-3xl mb-1">➡️</span>
              <span className="text-xs font-bold">Right</span>
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
