export const parseCommands = (code) => {
  const actions = [];

  // Basic regex parser
  const parseBlock = (text) => {
    const tokens = text.match(/moveForward\(\)|turnLeft\(\)|turnRight\(\)|repeat\(\d+\)\s*\{[^}]+\}/g);

    if (!tokens) return [];

    let blockActions = [];

    for (const token of tokens) {
      if (token === 'moveForward()') {
        blockActions.push('MOVE_FORWARD');
      } else if (token === 'turnLeft()') {
        blockActions.push('TURN_LEFT');
      } else if (token === 'turnRight()') {
        blockActions.push('TURN_RIGHT');
      } else if (token.startsWith('repeat')) {
        const match = token.match(/repeat\((\d+)\)\s*\{([^}]+)\}/);
        if (match) {
          const count = parseInt(match[1], 10);
          const innerContent = match[2];
          const innerActions = parseBlock(innerContent);

          for (let i = 0; i < count; i++) {
            blockActions = blockActions.concat(innerActions);
          }
        }
      }
    }

    return blockActions;
  };

  return parseBlock(code);
};
