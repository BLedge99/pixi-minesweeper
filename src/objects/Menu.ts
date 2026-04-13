import { Container, Graphics, Text } from 'pixi.js';
import { Grid } from './Grid';
import { Button, Input, Select } from '@pixi/ui';

export class Menu extends Container {
    private screenWidth: number;
    private screenHeight: number;
    private gridSizeInput!: Input;
    private difficultyInput!: Select;
    private readonly difficultyLabels = ['easy', 'medium', 'hard'];
    
    private readonly bombMultipliers: Record<string, number> = {
        easy: 0.1,
        medium: 0.15,
        hard: 0.2,
    };

    constructor(screenWidth: number, screenHeight: number) {
        super();
        this.screenWidth = screenWidth;
        this.screenHeight = screenHeight;
        this.showButtons();
    }

    private createButton(label: string, width: number, height: number, callback: () => void): Container {
        const container = new Container();
        
        const bg = new Graphics()
            .beginFill(0x444444)
            .drawRoundedRect(0, 0, width, height, 12)
            .endFill();
        
        const text = new Text(label, { fill: 0xffffff, fontSize: 20 });
        text.anchor.set(0.5);
        text.x = width / 2;
        text.y = height / 2;

        container.addChild(bg, text);
        
        const btn = new Button(container);
        
        
        btn.onPress.connect(callback);
        
        
        btn.onHover.connect(() => { bg.tint = 0xaaaaaa; });
        btn.onOut.connect(() => { bg.tint = 0xffffff; });
        
        return container; 
    }

    private showButtons(): void {
        const centerX = this.screenWidth / 2;
        const centerY = this.screenHeight / 2;
        const uiWidth = 240;
        const uiHeight = 50;

       
        const mainTitle = new Text('MINESWEEPER', {
            fill: 0xffffff,
            fontSize: 48,
            fontWeight: 'bold',
        });
        mainTitle.anchor.set(0.5);
        mainTitle.x = centerX;
        mainTitle.y = centerY - 200;
        this.addChild(mainTitle);

       
        const startBtnView = this.createButton('START GAME', uiWidth, uiHeight, () => this.startGame());
        startBtnView.x = centerX - uiWidth / 2;
        startBtnView.y = centerY - 60;
        this.addChild(startBtnView);

        const inputBg = new Graphics()
            .beginFill(0x444444)
            .drawRoundedRect(0, 0, uiWidth, uiHeight, 12)
            .endFill();

        this.gridSizeInput = new Input({
            bg: inputBg,
            padding: 12,
            placeholder: 'Grid Size (5-30)',
            textStyle: { fill: 0xffffff, fontSize: 18 },
            value: 'Enter Grid Size (5-30)',
        });
        this.gridSizeInput.x = centerX - uiWidth / 2;
        this.gridSizeInput.y = centerY + 10;
        this.addChild(this.gridSizeInput);

        const selectBg = new Graphics()
            .beginFill(0x444444)
            .drawRoundedRect(0, 0, uiWidth, uiHeight, 12)
            .endFill();
            
        const selectOpenBg = new Graphics()
            .beginFill(0x555555) 
            .drawRoundedRect(0, 0, uiWidth, uiHeight, 12)
            .endFill();

        this.difficultyInput = new Select({
            closedBG: selectBg,
            openBG: selectOpenBg,
            textStyle: { fill: 0xffffff, fontSize: 18 }, 
            items: {
                items: this.difficultyLabels,
                backgroundColor: 0x333333,
                hoverColor: 0x666666,
                width: uiWidth,
                height: uiHeight,
                textStyle: { fill: 0xffffff, fontSize: 18, fontWeight: 'bold' }, 
                radius: 12,
            },
            scrollBox: {
                width: uiWidth,
                height: uiHeight * 3, 
                radius: 12,
            }
        });
        
        this.difficultyInput.x = centerX - uiWidth / 2;
        this.difficultyInput.y = centerY + 80;
        
        this.addChild(this.difficultyInput);
    }

    private startGame(): void {
        const gridSize = parseInt(this.gridSizeInput.value);
        if (isNaN(gridSize) || gridSize < 5 || gridSize > 30) {
            alert('Enter a size between 5 and 30');
            return;
        }

        const difficulty = (this.difficultyInput.value || 'medium') as keyof typeof this.bombMultipliers;
        const multiplier = this.bombMultipliers[difficulty] || 0.15;
        const bombCount = Math.floor(gridSize * gridSize * multiplier);
        
        this.removeChildren();

        const grid = new Grid(gridSize, gridSize, 48, bombCount);
        grid.x = (this.screenWidth - (gridSize * 48)) / 2;
        grid.y = (this.screenHeight - (gridSize * 48)) / 2;
        this.addChild(grid);
    }
}