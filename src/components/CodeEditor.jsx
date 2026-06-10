import React from 'react';

const CodeEditor = ({ levelInstructions, levelNumber, code, setCode, onRunCode, gameState }) => {
  return (
    <div className="w-full h-full bg-game-dark-blue text-game-white p-8 flex flex-col shadow-xl">
      <div className="mb-6">
        <h2 className="text-3xl font-bold mb-2 text-game-light-blue">Level {levelNumber}</h2>
        <p className="text-lg opacity-90">{levelInstructions}</p>
      </div>

      <div className="flex-grow flex flex-col">
        <div className="bg-opacity-20 bg-black rounded-t-lg p-2 border-b border-gray-600 flex justify-between items-center">
          <span className="font-mono text-sm opacity-70">main.js</span>
          <span className="text-xs opacity-50">Commands: moveForward(), turnLeft(), turnRight(), repeat(n) {'{...}'}</span>
        </div>
        <textarea
          className="w-full flex-grow bg-[#1e253c] text-game-white p-4 font-mono text-lg resize-none outline-none rounded-b-lg shadow-inner focus:ring-2 focus:ring-game-light-blue"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="// Type your code here..."
          disabled={gameState === 'RUNNING'}
          spellCheck="false"
        />
      </div>

      <div className="mt-6 flex justify-end">
        <button
          className={`px-8 py-3 rounded-lg font-bold text-lg shadow-md transition-all
            ${gameState === 'RUNNING'
              ? 'bg-gray-500 text-gray-300 cursor-not-allowed'
              : 'bg-game-light-blue text-game-dark-blue hover:bg-opacity-90 hover:shadow-lg active:transform active:scale-95'
            }`}
          onClick={onRunCode}
          disabled={gameState === 'RUNNING'}
        >
          {gameState === 'RUNNING' ? 'Running...' : 'Run Code'}
        </button>
      </div>
    </div>
  );
};

export default CodeEditor;
