// Function to create blood particles
export class BloodParticle {
  x: number;
  y: number;
  vx: number; // Velocity X
  vy: number; // Velocity Y
  radius: number;
  alpha: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.vx = (Math.random() - 0.5) * 6; // Random spread
    this.vy = Math.random() * -3; // Slight upward velocity
    this.radius = Math.random() * 3 + 2; // Random size
    this.alpha = 1; // Opacity
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += 0.1; // Gravity effect
    this.alpha -= 0.01; // Fade out
    if (this.alpha < 0) this.alpha = 0;
  }

  draw(ctx: CanvasRenderingContext2D | null) {
    this.update();
    if(ctx){
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.restore();
  }
}
}


