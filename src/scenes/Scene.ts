import { Container } from 'pixi.js';
import { Menu } from '../objects/Menu';

export class Scene extends Container {

    constructor(screenWidth: number, screenHeight: number) {
        super();
        
        const menu = new Menu(screenWidth, screenHeight);

        // centre the grid on screen

        this.addChild(menu);
  }
}