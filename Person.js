class Person extends GameObject {
  constructor(config) {
    super(config);
    this.movingProgressRemaining = 0;
    this.directionUpdate = {
      up: ["y", -1],
      down: ["y", 1],
      left: ["x", -1],
      right: ["x", 1],
    };
    this.isPlayerControlled = config.isPlayerControlled || false;
  }

  update(state) {
    if (this.movingProgressRemaining > 0) {
      this.upgdatePosition();
    } else {
      // More cases for starting to walk will go here...

      // Case: We're keyboard ready and have an arrow pressed
      if (
        !state.map.isCutscenePlaying &&
        this.isPlayerControlled &&
        state.arrow
      ) {
        this.startBehaviour(state, {
          type: "walk",
          direction: state.arrow,
        });
      }
      this.updateSprite(state);
    }
  }

  startBehaviour(state, behaviour) {
    //Set Character direction to whatever behaviour has
    this.direction = behaviour.direction;

    if (behaviour.type === "walk") {
      // Stop here if space is taken
      if (state.map.isSpaceTaken(this.x, this.y, this.direction)) {
        // Unless retry is true
        behaviour.retry &&
          setTimeout(() => {
            this.startBehaviour(state, behaviour);
          }, 10);

        return;
      }

      // Ready to walk!
      state.map.moveWall(this.x, this.y, this.direction);
      this.movingProgressRemaining = 16;
      this.updateSprite(state);
    }

    if (behaviour.type === "stand") {
      setTimeout(() => {
        utils.emitEvent("PersonStandComplete", { whoId: this.id });
      }, behaviour.time);
    }
  }

  upgdatePosition() {
    if (this.movingProgressRemaining > 0) {
      const [property, change] = this.directionUpdate[this.direction];
      this[property] += change;
      this.movingProgressRemaining -= 1;
    }
    if (this.movingProgressRemaining === 0) {
      // Walk finished!
      utils.emitEvent("PersonWalkComplete", {
        whoId: this.id,
      });
    }
  }

  updateSprite() {
    if (this.movingProgressRemaining === 0) {
      this.sprite.setAnimation("idle-" + this.direction);
      return;
    }
    this.sprite.setAnimation("walk-" + this.direction);
  }
}
