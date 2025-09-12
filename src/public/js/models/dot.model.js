export class Dot {
  constructor({ x = 20, y = 20, radius = 10, score = 10, color = "green", head = false } = {}) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.score = score;
    this.color = color;
    this.head = head;
  }

  static create(input) {
    return new Dot(input);
  }
}