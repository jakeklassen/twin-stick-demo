export class Vector2 {
  public static Zero() {
    return new this(0, 0);
  }

  public x: number;
  public y: number;

  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }
}
