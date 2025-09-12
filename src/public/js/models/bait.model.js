export class Bait {
  constructor({ x = 50, y = 20, radius = 10, coefficient = 1, color = "red" } = {}) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.coefficient = coefficient;
    this.color = color;
  }

  static create(input) {
    return new Bait(input);
  }
}