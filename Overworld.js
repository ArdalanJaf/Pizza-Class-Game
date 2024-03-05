class Overworld {
  constructor(config) {
    this.element = config.element;
    this.canvas = this.element.querySelector(".game-canvas");
    this.ctx = this.canvas.getContext("2d");
  }

  init() {
    // load map
    const image = new Image();
    image.onload = () => {
      this.ctx.drawImage(image, 0, 0);
    };
    image.src = "/images/maps/DemoLower.png";

    // load hero sprite
    const x = 5;
    const y = 6;

    const shadow = new Image()
    shadow.onload = () => {
      this.ctx.drawImage(shadow, 
        0, // left cut 
        0, // top cut
        32, // width of cut
        32, // height of cut
        x * 16 - 8, // horizontal position on canvas
        y * 16 - 18, // vertical position on canvas
        32, // width size
        32  // height size
      )
    }
    shadow.src = "/images/characters/shadow.png"

    const hero = new Image();
    hero.onload =() => {
      this.ctx.drawImage(hero, 
        0, // left cut 
        0, // top cut
        32, // width of cut
        32, // height of cut
        x * 16 - 8, // horizontal position on canvas
        y * 16 - 18, // vertical position on canvas
        32, // width size
        32  // height size
      );
    }
    hero.src = "/images/characters/people/hero.png";
  }
}
