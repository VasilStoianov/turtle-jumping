export class PlayerAnimation {
  frames: number;
  images: CanvasImageSource[];
  currentFrame: number;
  latency: number;
  elapsedTime: number;
  loop: boolean;
  stagFrames:number;;
  constructor(frames: number, src: string,latency: number,loop: boolean,stageFrames: number) {
    this.images = [];
    this.stagFrames = stageFrames;
    this.frames = frames;
    this.latency = latency;
    this.elapsedTime = Date.now();
    this.loop = loop;
    for (let x = 0; x <= frames; x++) {
      let img = new Image();
      img.src = src + x + ".png";
      this.images.push(img);
    }
    this.currentFrame = 0;
  }
}