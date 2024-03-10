class OverworldMap {
  constructor(config) {
    this.gameObjects = config.gameObjects;
    this.cutsceneSpaces = config.cutsceneSpaces;
    this.walls = config.walls || {};

    this.lowerImage = new Image();
    this.lowerImage.src = config.lowerSrc;

    this.upperImage = new Image();
    this.upperImage.src = config.upperSrc;

    this.isCutscenePlaying = false;
  }

  drawLowerImage = (ctx, cameraPerson) => {
    ctx.drawImage(
      this.lowerImage,
      utils.withGrid(10.5) - cameraPerson.x,
      utils.withGrid(6) - cameraPerson.y
    );
  };

  drawUpperImage = (ctx, cameraPerson) => {
    ctx.drawImage(
      this.upperImage,
      utils.withGrid(10.5) - cameraPerson.x,
      utils.withGrid(6) - cameraPerson.y
    );
  };

  isSpaceTaken(currentX, currentY, direction) {
    const { x, y } = utils.nextPosition(currentX, currentY, direction);
    return this.walls[`${x},${y}`] || false;
  }

  mountObjects() {
    Object.keys(this.gameObjects).forEach((key) => {
      let object = this.gameObjects[key];
      object.id = key;

      // TODO: determine if this object should actually mount

      object.mount(this);
    });
  }

  async startCutScene(events) {
    this.isCutscenePlaying = true;

    // Start a loop of async events
    for (const event of events) {
      const eventHandler = new OverworldEvent({
        event,
        map: this,
      });
      await eventHandler.init();
    }

    this.isCutscenePlaying = false;

    // Reset NPC to go back to doing their behaviourLoop
    Object.values(this.gameObjects).forEach((object) =>
      object.doBehaviourEvent(this)
    );
  }

  checkForActionCutscene() {
    const hero = this.gameObjects["hero"];
    const nextCoords = utils.nextPosition(hero.x, hero.y, hero.direction);
    const match = Object.values(this.gameObjects).find((object) => {
      return object.x === nextCoords.x && object.y === nextCoords.y;
    });
    if (!this.isCutscenePlaying && match && match.talking.length) {
      this.startCutScene(match.talking[0].events);
    }
  }

  checkForFootstepCutscene() {
    const hero = this.gameObjects["hero"];
    const match = this.cutsceneSpaces[`${hero.x},${hero.y}`];
    if (!this.isCutscenePlaying && match) {
      this.startCutScene(match[0].events);
    }
  }

  addWall(x, y) {
    this.walls[`${x},${y}`] = true;
  }

  removeWall(x, y) {
    delete this.walls[`${x},${y}`];
  }

  moveWall(wasX, wasY, direction) {
    this.removeWall(wasX, wasY);
    const { x, y } = utils.nextPosition(wasX, wasY, direction);
    this.addWall(x, y);
  }
}

window.OverworldMaps = {
  DemoRoom: {
    lowerSrc: "/images/maps/DemoLower.png",
    upperSrc: "/images/maps/DemoUpper.png",
    gameObjects: {
      hero: new Person({
        x: utils.withGrid(5),
        y: utils.withGrid(6),
        isPlayerControlled: true,
      }),
      npcA: new Person({
        x: utils.withGrid(8),
        y: utils.withGrid(5),
        src: "/images/characters/people/npc1.png",
        behaviourLoop: [
          { type: "stand", direction: "down", time: 800 },
          { type: "stand", direction: "right", time: 400 },
          { type: "stand", direction: "left", time: 800 },
        ],
        talking: [
          {
            events: [
              {
                type: "textMessage",
                text: "Can't you see I'm busy?",
                faceHero: "npcA",
              },
              { type: "textMessage", text: "Go away!" },
              { type: "walk", direction: "left", who: "hero" },
            ],
          },
        ],
      }),
      npcB: new Person({
        x: utils.withGrid(2),
        y: utils.withGrid(8),
        src: "/images/characters/people/npc2.png",
        behaviourLoop: [
          { type: "walk", direction: "right" },
          { type: "walk", direction: "up" },
          { type: "stand", direction: "right", time: 800 },
          { type: "walk", direction: "left" },
          { type: "walk", direction: "down" },
        ],
      }),
      npcC: new Person({
        x: utils.withGrid(7),
        y: utils.withGrid(3),
        src: "/images/characters/people/npc3.png",
      }),
    },
    walls: {
      [utils.asGridCoord(7, 6)]: true,
      [utils.asGridCoord(8, 6)]: true,
      [utils.asGridCoord(7, 7)]: true,
      [utils.asGridCoord(8, 7)]: true,
    },
    cutsceneSpaces: {
      [utils.asGridCoord(7, 4)]: [
        {
          events: [
            { type: "walk", direction: "down", who: "hero" },
            // { type: "stand", direction: "up", who: "hero" },
            { type: "walk", direction: "down", who: "npcC" },
            { type: "textMessage", text: "You can't come in!" },
            { type: "walk", direction: "up", who: "npcC" },
          ],
        },
      ],
    },
  },
  Kitchen: {
    lowerSrc: "/images/maps/KitchenLower.png",
    upperSrc: "/images/maps/KitchenUpper.png",
    gameObjects: {
      hero: new GameObject({
        x: 3,
        y: 1,
      }),
      npc2: new GameObject({
        x: 1,
        y: 8,
        src: "/images/characters/people/npc2.png",
      }),
      npc3: new GameObject({
        x: 2,
        y: 8,
        src: "/images/characters/people/npc3.png",
      }),
    },
  },
};
