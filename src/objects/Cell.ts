import {Container, Graphics, Sprite, Text} from "pixi.js";

export class Cell extends Container {
    private readonly cellSize: number;
    private bg: Graphics;

    public isBomb: boolean = false;
    public isRevealed: boolean = false
    public isFlagged: boolean = false;
    public adjacentBombs: number = 0;

    constructor(cellSize: number, isBomb: boolean) {
        super();

        this.cellSize = cellSize;
        this.isBomb = isBomb;

        this.bg = new Graphics();
        this.bg.lineStyle(2, 0x000000);
        this.bg.beginFill(0xcccccc);
        this.bg.drawRect(0, 0, cellSize, cellSize);
        this.bg.endFill();

        this.addChild(this.bg);

        this.eventMode = 'static';
        this.on('pointerdown', (event) => {
            if (event.button !== 0) return; // only left click
            this.onClick();
    });
        this.on('rightclick', this.onFlag);
    }

    private onClick() {

        const colours: Record<number, number> = {
            1: 0x00ff00, // green
            2: 0x40ff00,
            3: 0x80ff00,
            4: 0xbfff00,
            5: 0xffff00, // yellow
            6: 0xff8000,
            7: 0xff4000,
            8: 0xff0000, // red
        };
        
        if (this.isRevealed) return;
        this.isRevealed = true;

        if (this.isBomb) {
            const bomby = Sprite.from('/bomb.jpg');
            bomby.width = this.cellSize * 0.8;
            bomby.height = this.cellSize * 0.8;
            bomby.x = this.cellSize * 0.1;
            bomby.y = this.cellSize * 0.1;
            this.addChild(bomby);

            this.bg.beginFill(0xff0000);
            this.bg.drawRect(0, 0, this.cellSize, this.cellSize);
            this.bg.endFill();
        } else {
            this.bg.beginFill(0x999999);
            this.bg.drawRect(0, 0, this.cellSize, this.cellSize);
            this.bg.endFill();  

            if (this.adjacentBombs > 0) {
                const text = new Text(this.adjacentBombs.toString(), {
                    fill: colours[this.adjacentBombs] ?? 0x000000,
                    fontSize: this.cellSize * 0.6
                });
                text.anchor.set(0.5);
                text.x = this.cellSize / 2;
                text.y = this.cellSize / 2;
                this.addChild(text);
            }
        }
    }

    private onFlag() {
        if (this.isRevealed) return;
        this.isFlagged = !this.isFlagged;

        const flagy = Sprite.from('/flag.jpg');
        flagy.width = this.cellSize * 0.8;
        flagy.height = this.cellSize * 0.8;
        flagy.x = this.cellSize * 0.1;
        flagy.y = this.cellSize * 0.1;
        if (this.isFlagged) {
            this.addChild(flagy);
        } else {
            this.removeChild(flagy);
        }
    }

    public setAdjacentBombs(count: number) {
        this.adjacentBombs = count;
    }
}