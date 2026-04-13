import { Container, Text } from 'pixi.js';
import { Grid } from './Grid';

export class Menu extends Container {
    private screenWidth: number;
    private screenHeight: number;
    private gridSizeInput!: HTMLInputElement;
    private difficultyInput!: HTMLSelectElement;
    private startButton!: HTMLButtonElement;

    private readonly bombMultipliers: Record<string, number> = {
        easy:   0.1,
        medium: 0.2,
        hard:   0.4,
    };

    constructor(screenWidth: number, screenHeight: number) {
        super();
        this.screenWidth  = screenWidth;
        this.screenHeight = screenHeight;

        const title = new Text('Minesweeper', {
            fill: 0xffffff,
            fontSize: 36,
            fontWeight: 'bold',
        });
        title.anchor.set(0.5);
        title.x = screenWidth / 2;
        title.y = screenHeight / 2 - 200;
        this.addChild(title);

        this.showButtons();
    }

    private showButtons(): void {
        // Grid size input
        this.gridSizeInput = document.createElement('input');
        this.gridSizeInput.type  = 'number';
        this.gridSizeInput.value = '12';
        this.gridSizeInput.min   = '5';
        this.gridSizeInput.max   = '30';
        Object.assign(this.gridSizeInput.style, {
            position:  'absolute',
            left:      '50%',
            top:       'calc(50% - 20px)',
            transform: 'translate(-50%, -50%)',
        });
        document.body.appendChild(this.gridSizeInput);

        // Difficulty dropdown
        this.difficultyInput = document.createElement('select');
        (['Easy', 'Medium', 'Hard'] as const).forEach(level => {
            const option = document.createElement('option');
            option.value       = level.toLowerCase();
            option.textContent = level;
            this.difficultyInput.appendChild(option);
        });
        Object.assign(this.difficultyInput.style, {
            position:  'absolute',
            left:      '50%',
            top:       'calc(50% + 20px)',
            transform: 'translate(-50%, -50%)',
        });
        document.body.appendChild(this.difficultyInput);

        // Start button
        this.startButton = document.createElement('button');
        this.startButton.textContent = 'Start Game';
        Object.assign(this.startButton.style, {
            position:  'absolute',
            left:      '50%',
            top:       'calc(50% + 60px)',
            transform: 'translate(-50%, -50%)',
        });
        this.startButton.addEventListener('click', () => this.startGame());
        document.body.appendChild(this.startButton);
    }

    private removeButtons(): void {
        this.gridSizeInput.remove();
        this.difficultyInput.remove();
        this.startButton.remove();
    }

    private startGame(): void {
        const gridSize   = Math.max(5, Math.min(30, parseInt(this.gridSizeInput.value, 10) || 12));
        const difficulty = this.difficultyInput.value;
        const bombCount  = Math.floor(gridSize * gridSize * this.bombMultipliers[difficulty]);
        const cellSize   = 48;

        console.log(`Starting game: ${gridSize}x${gridSize}, ${difficulty}, ${bombCount} bombs`);

        this.removeButtons();
        this.removeChildren();

        const grid = new Grid(gridSize, gridSize, cellSize, bombCount);
        grid.x = (this.screenWidth  - gridSize * cellSize) / 2;
        grid.y = (this.screenHeight - gridSize * cellSize) / 2;
        this.addChild(grid);
    }

}