import * as fs from 'fs';
import * as _ from 'lodash';

function generateMaze(size: number): number[][] {
  const WALL_PROBABILITY = 0.7;
  const maze = _.times(size, () => _.times(size, () => (_.random(0, 1) < WALL_PROBABILITY ? 0 : 1)));
  maze[0][0] = 0;  // Start
  maze[size - 1][size - 1] = 0;  // Goal
  return maze;
}

function saveMazeToJson(maze: number[][], filename: string): void {
  try {
    fs.writeFileSync(filename, JSON.stringify(maze, null, 2));
  } catch (error) {
    console.error(`Error writing maze to file ${filename}:`, error);
  }
}

const size = 20;
const maze = generateMaze(size);
saveMazeToJson(maze, './src/maze.json');

console.log('Maze generated and saved to maze.json');
