import { Vector2D } from "./vector2d.js";

export class Assets {
  asset: HTMLImageElement;
  size: {
    width: number;
    heigth: number;
  };
  position: Vector2D;

  constructor(
    src: string,
    size: { width: number; heidth: number },
    position: Vector2D
  ) {
    this.asset = new Image(size.width, size.heidth);
    this.position = position;
    this.size = {
      width: size.width,
      heigth: size.heidth,
    };
    this.asset.src = src;
  }
}

