class KeyPressListener {
  constructor(keyCode, callBack) {
    // flag to make sure held key is not registered as multiple key-presses
    let keySafe = true;
    this.keydownFunction = function (event) {
      if (event.code === keyCode) {
        if (keySafe) {
          keySafe = false;
          callBack();
        }
      }
    };
    this.keyUpFunction = function (event) {
      if (event.code === keyCode) {
        keySafe = true;
      }
    };

    document.addEventListener("keydown", this.keydownFunction);
    document.addEventListener("keyup", this.keyUpFunction);
  }

  unbind() {
    document.removeEventListener("keydown", this.keydownFunction);
    document.removeEventListener("keyup", this.keyUpFunction);
  }
}
