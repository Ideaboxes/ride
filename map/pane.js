'use strict'

const CENTER = 0
  , TOP = 1
  , RIGHT = 2
  , BOTTOM = 3
  , LEFT = 4

class Pane {

  constructor(options) {
    this.options = options || {
      size: 3000,
      degree: 0.1
    }
  }

  key(location, position) {
  }
}

Pane.CENTER = CENTER
Pane.TOP = TOP
Pane.RIGHT = RIGHT
Pane.BOTTOM = BOTTOM
Pane.LEFT = LEFT

module.exports = Pane
