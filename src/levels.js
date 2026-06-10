export const levels = [
  // Levels 1-5: Basic movement and turning.
  {
    id: 1,
    instructions: "Use moveForward() to reach the goal.",
    gridSize: 8,
    startPos: { x: 0, y: 0, facing: 'EAST' },
    goalPos: { x: 3, y: 0 },
    walls: []
  },
  {
    id: 2,
    instructions: "Reach the goal using moveForward() and turnRight().",
    gridSize: 8,
    startPos: { x: 0, y: 0, facing: 'EAST' },
    goalPos: { x: 3, y: 3 },
    walls: []
  },
  {
    id: 3,
    instructions: "Reach the goal using moveForward() and turnLeft().",
    gridSize: 8,
    startPos: { x: 3, y: 3, facing: 'WEST' },
    goalPos: { x: 0, y: 0 },
    walls: []
  },
  {
    id: 4,
    instructions: "Navigate around the edge of the board.",
    gridSize: 8,
    startPos: { x: 0, y: 0, facing: 'EAST' },
    goalPos: { x: 0, y: 1 }, // Need to go all the way around? Or just back up? Let's make it simple.
    walls: []
  },
  {
    id: 5,
    instructions: "Turn multiple times to reach the goal.",
    gridSize: 8,
    startPos: { x: 4, y: 4, facing: 'NORTH' },
    goalPos: { x: 6, y: 6 },
    walls: []
  },

  // Levels 6-10: Introducing obstacles (walls) requiring complex paths.
  {
    id: 6,
    instructions: "Avoid the wall to reach the goal.",
    gridSize: 8,
    startPos: { x: 0, y: 0, facing: 'EAST' },
    goalPos: { x: 4, y: 0 },
    walls: [{ x: 2, y: 0 }]
  },
  {
    id: 7,
    instructions: "Navigate the corridor.",
    gridSize: 8,
    startPos: { x: 0, y: 0, facing: 'EAST' },
    goalPos: { x: 4, y: 2 },
    walls: [{ x: 2, y: 0 }, { x: 2, y: 1 }]
  },
  {
    id: 8,
    instructions: "Find your way around the central block.",
    gridSize: 8,
    startPos: { x: 0, y: 3, facing: 'EAST' },
    goalPos: { x: 6, y: 3 },
    walls: [{ x: 3, y: 2 }, { x: 3, y: 3 }, { x: 3, y: 4 }]
  },
  {
    id: 9,
    instructions: "Navigate a simple zig-zag.",
    gridSize: 8,
    startPos: { x: 0, y: 0, facing: 'EAST' },
    goalPos: { x: 4, y: 4 },
    walls: [{ x: 2, y: 0 }, { x: 2, y: 2 }, { x: 4, y: 2 }]
  },
  {
    id: 10,
    instructions: "A small room with one exit.",
    gridSize: 8,
    startPos: { x: 1, y: 1, facing: 'EAST' },
    goalPos: { x: 5, y: 1 },
    walls: [
      { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 },
      { x: 0, y: 1 },                                 { x: 3, y: 1 },
      { x: 0, y: 2 }, { x: 1, y: 2 },                 { x: 3, y: 2 }
    ]
  },

  // Levels 11-15: Introducing the repeat() concept.
  {
    id: 11,
    instructions: "Use repeat(4) { moveForward() } to reach the goal in fewer lines of code.",
    gridSize: 8,
    startPos: { x: 0, y: 0, facing: 'EAST' },
    goalPos: { x: 4, y: 0 },
    walls: []
  },
  {
    id: 12,
    instructions: "Use repeat to travel a long distance, then turn.",
    gridSize: 10,
    startPos: { x: 0, y: 0, facing: 'EAST' },
    goalPos: { x: 8, y: 8 },
    walls: []
  },
  {
    id: 13,
    instructions: "Use repeat with multiple commands inside.",
    gridSize: 8,
    startPos: { x: 0, y: 0, facing: 'EAST' },
    goalPos: { x: 4, y: 4 },
    walls: []
  },
  {
    id: 14,
    instructions: "Use repeat to avoid a row of obstacles.",
    gridSize: 8,
    startPos: { x: 0, y: 0, facing: 'SOUTH' },
    goalPos: { x: 6, y: 6 },
    walls: [{ x: 1, y: 1 }, { x: 2, y: 2 }, { x: 3, y: 3 }, { x: 4, y: 4 }]
  },
  {
    id: 15,
    instructions: "A larger repetitive pattern.",
    gridSize: 10,
    startPos: { x: 0, y: 0, facing: 'EAST' },
    goalPos: { x: 9, y: 9 },
    walls: []
  },

  // Levels 16-20: Highly complex mazes requiring efficient code.
  {
    id: 16,
    instructions: "Navigate the maze. Efficiency is key.",
    gridSize: 10,
    startPos: { x: 0, y: 0, facing: 'EAST' },
    goalPos: { x: 9, y: 0 },
    walls: [
      { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 1, y: 2 }, { x: 1, y: 3 },
      { x: 3, y: 9 }, { x: 3, y: 8 }, { x: 3, y: 7 }, { x: 3, y: 6 },
      { x: 5, y: 0 }, { x: 5, y: 1 }, { x: 5, y: 2 }, { x: 5, y: 3 },
      { x: 7, y: 9 }, { x: 7, y: 8 }, { x: 7, y: 7 }, { x: 7, y: 6 }
    ]
  },
  {
    id: 17,
    instructions: "Spiral inwards to the goal.",
    gridSize: 10,
    startPos: { x: 0, y: 0, facing: 'EAST' },
    goalPos: { x: 5, y: 4 },
    walls: [
      { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 3, y: 1 }, { x: 4, y: 1 }, { x: 5, y: 1 }, { x: 6, y: 1 }, { x: 7, y: 1 }, { x: 8, y: 1 },
      { x: 8, y: 2 }, { x: 8, y: 3 }, { x: 8, y: 4 }, { x: 8, y: 5 }, { x: 8, y: 6 }, { x: 8, y: 7 }, { x: 8, y: 8 },
      { x: 7, y: 8 }, { x: 6, y: 8 }, { x: 5, y: 8 }, { x: 4, y: 8 }, { x: 3, y: 8 }, { x: 2, y: 8 }, { x: 1, y: 8 },
      { x: 1, y: 7 }, { x: 1, y: 6 }, { x: 1, y: 5 }, { x: 1, y: 4 }, { x: 1, y: 3 }, { x: 1, y: 2 }
    ]
  },
  {
    id: 18,
    instructions: "Checkerboard of obstacles.",
    gridSize: 10,
    startPos: { x: 0, y: 0, facing: 'EAST' },
    goalPos: { x: 9, y: 9 },
    walls: [
      { x: 1, y: 1 }, { x: 3, y: 1 }, { x: 5, y: 1 }, { x: 7, y: 1 },
      { x: 1, y: 3 }, { x: 3, y: 3 }, { x: 5, y: 3 }, { x: 7, y: 3 },
      { x: 1, y: 5 }, { x: 3, y: 5 }, { x: 5, y: 5 }, { x: 7, y: 5 },
      { x: 1, y: 7 }, { x: 3, y: 7 }, { x: 5, y: 7 }, { x: 7, y: 7 },
    ]
  },
  {
    id: 19,
    instructions: "The long winding road.",
    gridSize: 10,
    startPos: { x: 0, y: 9, facing: 'EAST' },
    goalPos: { x: 9, y: 0 },
    walls: [
      { x: 0, y: 8 }, { x: 1, y: 8 }, { x: 2, y: 8 }, { x: 3, y: 8 }, { x: 4, y: 8 }, { x: 5, y: 8 }, { x: 6, y: 8 }, { x: 7, y: 8 }, { x: 8, y: 8 },
      { x: 1, y: 6 }, { x: 2, y: 6 }, { x: 3, y: 6 }, { x: 4, y: 6 }, { x: 5, y: 6 }, { x: 6, y: 6 }, { x: 7, y: 6 }, { x: 8, y: 6 }, { x: 9, y: 6 },
      { x: 0, y: 4 }, { x: 1, y: 4 }, { x: 2, y: 4 }, { x: 3, y: 4 }, { x: 4, y: 4 }, { x: 5, y: 4 }, { x: 6, y: 4 }, { x: 7, y: 4 }, { x: 8, y: 4 },
      { x: 1, y: 2 }, { x: 2, y: 2 }, { x: 3, y: 2 }, { x: 4, y: 2 }, { x: 5, y: 2 }, { x: 6, y: 2 }, { x: 7, y: 2 }, { x: 8, y: 2 }, { x: 9, y: 2 },
    ]
  },
  {
    id: 20,
    instructions: "Final Challenge: Use loops efficiently to navigate the grid.",
    gridSize: 10,
    startPos: { x: 0, y: 0, facing: 'SOUTH' },
    goalPos: { x: 9, y: 9 },
    walls: [
      { x: 0, y: 1 }, { x: 2, y: 0 }, { x: 2, y: 1 }, { x: 2, y: 2 }, { x: 2, y: 3 },
      { x: 4, y: 9 }, { x: 4, y: 8 }, { x: 4, y: 7 }, { x: 4, y: 6 }, { x: 4, y: 5 },
      { x: 6, y: 0 }, { x: 6, y: 1 }, { x: 6, y: 2 }, { x: 6, y: 3 }, { x: 6, y: 4 },
      { x: 8, y: 9 }, { x: 8, y: 8 }, { x: 8, y: 7 }, { x: 8, y: 6 }, { x: 8, y: 5 },
    ]
  }
];
