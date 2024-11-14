export class PlayerAnimation {
  frames: number;
  images: CanvasImageSource[];
  currentFrame: number;

  constructor(frames: number, src: string) {
    this.images = [];
    this.frames = frames;
    for (let x = 0; x <= frames; x++) {
      let img = new Image();
      img.src = src + x + ".png";
      this.images.push(img);
    }
    this.currentFrame = 0;
  }
}