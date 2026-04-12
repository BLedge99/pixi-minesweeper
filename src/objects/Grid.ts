import { Container } from "pixi.js";
import { Cell } from "./Cell";

export class Grid extends Container {
    private readonly gridWidth: number;
    private readonly gridHeight: number;
    private readonly cellSize: number;
    private cells : Cell[][] = [];
    

    constructor(gridWidth: number, gridHeight: number, cellSize: number, bombCount: number) {
        super();

        this.gridWidth = gridWidth;
        this.gridHeight = gridHeight;
        this.cellSize = cellSize;

        this.createGrid(bombCount);
        this.calcAdjacentBombs();
    }

    private createGrid(bombCount: number) {
        for (let y = 0; y < this.gridHeight; y++) {
            this.cells[y] = [];
            for (let x = 0; x < this.gridWidth; x++) {
                const isBomb = Math.random() < bombCount / (this.gridWidth * this.gridHeight);
                const cell = new Cell(this.cellSize, isBomb);
                cell.x = x * this.cellSize;
                cell.y = y * this.cellSize;
                this.addChild(cell);
                this.cells[y][x] = cell;
            }
        }
    }

    private calcAdjacentBombs() {
        for (let y = 0; y < this.gridHeight; y++) {
            for (let x = 0; x < this.gridWidth; x++) {
                const cell = this.cells[y][x];
                if (cell.isBomb) continue;
                let adjacentBombs = 0;
                for (let dy = -1; dy <= 1; dy++) {
                    for (let dx = -1; dx <= 1; dx++) {
                        if (dx === 0 && dy === 0) continue;
                        const nx = x + dx;
                        const ny = y + dy;
                        if (nx >= 0 && nx < this.gridWidth && ny >= 0 && ny < this.gridHeight) {
                            if (this.cells[ny][nx].isBomb) {
                                adjacentBombs++;
                            }
                        }
                    }
                }
                cell.setAdjacentBombs(adjacentBombs);
            }
        }
    }
}