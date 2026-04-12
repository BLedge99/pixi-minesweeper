import { Application, Assets } from 'pixi.js';
import { Scene } from './scenes/Scene';

const app = new Application();  // ← no generic

await app.init({
  canvas: document.getElementById('pixi-canvas') as HTMLCanvasElement,
  resolution: window.devicePixelRatio || 1,
  autoDensity: true,
  background: 0x6495ed,  // ← 'backgroundColor' also renamed in v8
  width: 1000,
  height: 700,
});

await Assets.load(['/bomb.jpg', '/flag.jpg']); 

const scene = new Scene(app.screen.width, app.screen.height);
app.stage.addChild(scene);

(app.canvas as HTMLCanvasElement).addEventListener('contextmenu', (e: MouseEvent) => e.preventDefault());