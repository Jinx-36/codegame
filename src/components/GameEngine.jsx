import React from 'react';

const GameEngine = ({ level, playerPos, playerFacing }) => {
  const { gridSize, goalPos, walls } = level;

  // Render the grid cells
  const cells = [];
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      const isPlayer = playerPos.x === x && playerPos.y === y;
      const isGoal = goalPos.x === x && goalPos.y === y;
      const isWall = walls.some(wall => wall.x === x && wall.y === y);

      cells.push(
        <div
          key={`${x}-${y}`}
          className={`w-full h-full border border-gray-200 flex items-center justify-center
            ${isWall ? 'bg-game-dark-blue' : 'bg-game-white'}
            ${isGoal && !isPlayer ? 'bg-green-200' : ''}
          `}
        >
          {isGoal && !isPlayer && !isWall && (
            <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
          )}
          {isPlayer && (
            <div
              className="text-4xl transition-transform duration-300 ease-in-out flex items-center justify-center"
              style={{
                transform: `rotate(${
                  playerFacing === 'NORTH' ? -45 :
                  playerFacing === 'EAST' ? 45 :
                  playerFacing === 'SOUTH' ? 135 :
                  playerFacing === 'WEST' ? 225 : -45
                }deg)`
              }}
            >
              🚀
            </div>
          )}
        </div>
      );
    }
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-gray-50">
      <div
        className="grid gap-1 bg-gray-300 p-1 rounded-lg shadow-lg"
        style={{
          gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
          width: 'min(80vh, 100%)',
          aspectRatio: '1 / 1'
        }}
      >
        {cells}
      </div>
    </div>
  );
};

export default GameEngine;
