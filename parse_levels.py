import json

raw_levels = [
  {
    "id": 1, "instructions": "Move forward to the goal.", "maxCommands": 3,
    "layout": ["XXXXXXXX","X102XXXX","XXXXXXXX","XXXXXXXX","XXXXXXXX","XXXXXXXX","XXXXXXXX","XXXXXXXX"]
  },
  {
    "id": 2, "instructions": "Keep moving!", "maxCommands": 4,
    "layout": ["XXXXXXXX","X1002XXX","XXXXXXXX","XXXXXXXX","XXXXXXXX","XXXXXXXX","XXXXXXXX","XXXXXXXX"]
  },
  {
    "id": 3, "instructions": "Time to turn.", "maxCommands": 4,
    "layout": ["XXXXXXXX","X100XXXX","XXX0XXXX","XXX2XXXX","XXXXXXXX","XXXXXXXX","XXXXXXXX","XXXXXXXX"]
  },
  {
    "id": 4, "instructions": "Navigate the corner.", "maxCommands": 6,
    "layout": ["XXXXXXXX","X10XXXXX","XX0XXXXX","XX002XXX","XXXXXXXX","XXXXXXXX","XXXXXXXX","XXXXXXXX"]
  },
  {
    "id": 5, "instructions": "A quick zig-zag.", "maxCommands": 7,
    "layout": ["XXXXXXXX","X10XXXXX","XX00XXXX","XXX002XX","XXXXXXXX","XXXXXXXX","XXXXXXXX","XXXXXXXX"]
  },
  {
    "id": 6, "instructions": "Avoid the wall.", "maxCommands": 6,
    "layout": ["XXXXXXXX","X10X02XX","XX000XXX","XXXXXXXX","XXXXXXXX","XXXXXXXX","XXXXXXXX","XXXXXXXX"]
  },
  {
    "id": 7, "instructions": "Go around the pillar.", "maxCommands": 8,
    "layout": ["XXXXXXXX","X100XXXX","XXX0XXXX","XXX002XX","XXXXXXXX","XXXXXXXX","XXXXXXXX","XXXXXXXX"]
  },
  {
    "id": 8, "instructions": "The U-Turn.", "maxCommands": 9,
    "layout": ["XXXXXXXX","X1000XXX","XXXX0XXX","X2000XXX","XXXXXXXX","XXXXXXXX","XXXXXXXX","XXXXXXXX"]
  },
  {
    "id": 9, "instructions": "Sneak past the blocks.", "maxCommands": 10,
    "layout": ["XXXXXXXX","X10X002X","XX000XXX","XXXXXXXX","XXXXXXXX","XXXXXXXX","XXXXXXXX","XXXXXXXX"]
  },
  {
    "id": 10, "instructions": "The long way around.", "maxCommands": 12,
    "layout": ["XXXXXXXX","X10000XX","XXXXX0XX","X20000XX","XXXXXXXX","XXXXXXXX","XXXXXXXX","XXXXXXXX"]
  },
  {
    "id": 11, "instructions": "Use a loop to walk the long hallway.", "maxCommands": 4,
    "layout": ["XXXXXXXX","X1000002","XXXXXXXX","XXXXXXXX","XXXXXXXX","XXXXXXXX","XXXXXXXX","XXXXXXXX"]
  },
  {
    "id": 12, "instructions": "Loop to the edge.", "maxCommands": 4,
    "layout": ["X1000XXX","XXXX0XXX","XXXX0XXX","XXXX2XXX","XXXXXXXX","XXXXXXXX","XXXXXXXX","XXXXXXXX"]
  },
  {
    "id": 13, "instructions": "Stairs! Use a loop to repeat the pattern.", "maxCommands": 6,
    "layout": ["XXXXXXXX","X10XXXXX","XX00XXXX","XXX00XXX","XXXX02XX","XXXXXXXX","XXXXXXXX","XXXXXXXX"]
  },
  {
    "id": 14, "instructions": "A bigger staircase.", "maxCommands": 6,
    "layout": ["X10XXXXX","XX00XXXX","XXX00XXX","XXXX00XX","XXXXX02X","XXXXXXXX","XXXXXXXX","XXXXXXXX"]
  },
  {
    "id": 15, "instructions": "The spiral loop.", "maxCommands": 6,
    "layout": ["XXXXXXXX","X1000XXX","XXXX0XXX","XX200XXX","XXXXXXXX","XXXXXXXX","XXXXXXXX","XXXXXXXX"]
  },
  {
    "id": 16, "instructions": "Loop around the center.", "maxCommands": 8,
    "layout": ["XXXXXXXX","X1000XXX","XXXX0XXX","XXXX0XXX","XX200XXX","XXXXXXXX","XXXXXXXX","XXXXXXXX"]
  },
  {
    "id": 17, "instructions": "Double loop pattern.", "maxCommands": 8,
    "layout": ["X100XXXX","XXX00XXX","XXXX00XX","XXXXX02X","XXXXXXXX","XXXXXXXX","XXXXXXXX","XXXXXXXX"]
  },
  {
    "id": 18, "instructions": "The Snake.", "maxCommands": 10,
    "layout": ["X10XXXXX","XX00XXXX","XXX00XXX","XXXX00XX","XXXXX002","XXXXXXXX","XXXXXXXX","XXXXXXXX"]
  },
  {
    "id": 19, "instructions": "Complex path. Be efficient!", "maxCommands": 10,
    "layout": ["XXXXXXXX","X100XXXX","XXX000XX","XXXXX0XX","XXX200XX","XXXXXXXX","XXXXXXXX","XXXXXXXX"]
  },
  {
    "id": 20, "instructions": "The Final Challenge.", "maxCommands": 12,
    "layout": ["XXXXXXXX","X10000XX","XXXXX0XX","XX0000XX","XX0XXXXX","XX2XXXXX","XXXXXXXX","XXXXXXXX"]
  }
]

parsed_levels = []

for l in raw_levels:
    gridSize = len(l['layout'])
    startPos = {"x": 0, "y": 0, "facing": "EAST"}
    goalPos = {"x": 0, "y": 0}
    walls = []
    for y, row in enumerate(l['layout']):
        for x, char in enumerate(row):
            if char == '1':
                startPos = {"x": x, "y": y, "facing": "EAST"}
            elif char == '2':
                goalPos = {"x": x, "y": y}
            elif char == 'X':
                walls.append({"x": x, "y": y})

    parsed_levels.append({
        "id": l['id'],
        "instructions": l['instructions'],
        "maxCommands": l['maxCommands'],
        "gridSize": gridSize,
        "startPos": startPos,
        "goalPos": goalPos,
        "walls": walls
    })

js_output = "export const levels = " + json.dumps(parsed_levels, indent=2) + ";\n"

with open('src/levels.js', 'w') as f:
    f.write(js_output)
