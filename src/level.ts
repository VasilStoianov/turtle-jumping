import { Vector2D } from "./vector2d.js";
import { Assets } from "./assets.js";
import { GAME_HEIGH,GAME_WIDTH } from "./game.js";

export class Level {
  blocks: Assets[];
  background_image: {
    img: HTMLImageElement;
    width: number;
    heidth: number;
    position: Vector2D;
  };

  constructor(src: string) {
    this.blocks = [];
    for (let x = 0; x <= GAME_WIDTH / 128; x++) {
      let block = new Assets(
        src,
        { width: 128, heidth: 128 },
        new Vector2D(x * 128, GAME_HEIGH - 128)
      );
      this.blocks.push(block);
    }

    this.background_image = {
      img: new Image(GAME_WIDTH, GAME_HEIGH),
      width: GAME_WIDTH,
      heidth: GAME_HEIGH,
      position: new Vector2D(0, 0),
    };
    this.background_image.img.src = "assets/background/bglayer0.png";
  }
}