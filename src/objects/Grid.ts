import { Container, Sprite, Text } from "pixi.js";
import { Cell } from "./Cell";
import { Easing, Tween } from "tweedle.js";

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
                cell.on('bombClicked', (bombSprite: Sprite) => {
                    this.endGame(bombSprite);
                });
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

    private endGame(sprite: Sprite) {

        const bombPosition = sprite.getGlobalPosition();

        sprite.parent?.removeChild(sprite);
        this.addChild(sprite);

        sprite.x = this.toLocal(bombPosition).x;
        sprite.y = this.toLocal(bombPosition).y;
        console.log('Tween starting, bomb at', sprite.x, sprite.y);
        this.showGameOver();

        new Tween(sprite)
            .to({ x: this.width / 2 - sprite.width / 2, y: this.height / 2 - sprite.height / 2 }, 1000)
            .easing(Easing.Back.Out)
            .start();
    }

    private showGameOver() {
        const text = new Text('Game Over', {
            fill: 0xff0000,
            fontSize: 48,
            fontWeight: 'bold'
        });
        text.anchor.set(0.5);
        text.x = this.width / 2;
        text.y = this.height / 2;
        this.addChild(text);
    }
}