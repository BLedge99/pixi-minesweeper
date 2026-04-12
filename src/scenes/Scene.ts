import { Container } from 'pixi.js';
import { Grid } from '../objects/Grid';

export class Scene extends Container {
  constructor(screenWidth: number, screenHeight: number) {
    super();

    const cols = 12;
    const rows = 12;
    const cellSize = 48;
    const bombCount = 20;

    const grid = new Grid(cols, rows, cellSize, bombCount);

    // centre the grid on screen
    grid.x = (screenWidth - cols * cellSize) / 2;
    grid.y = (screenHeight - rows * cellSize) / 2;

    this.addChild(grid);
  }
}