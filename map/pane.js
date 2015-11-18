'use strict'

let util = require('./util')

const CENTER = 0
  , TOP = 1
  , RIGHT = 2
  , BOTTOM = 3
  , LEFT = 4

// Each pane is 0.1 degree square
const degree = 0.1

class Pane {

  constructor(options) {
    this.options = options || {
      size: 3000
    }
  }

  key(location, position) {
    let length = degree.toString().length - 1

    // Alter the key base on the position
    let longitude = location.longitude
      , latitude = location.latitude

    switch (position) {
      case TOP:
        latitude += degree
        break
      case RIGHT:
        longitude += degree
        break
      case BOTTOM:
        latitude -= degree
        break
      case LEFT:
        longitude -= degree
        break
    }

    // Floor down the locations
    let degreeExp = Math.abs(+degree.toExponential().split('e')[1])
      , minX = util.floor(longitude, degreeExp)
      , minY = util.floor(latitude, degreeExp)
      , maxX = minX + degree
      , maxY = minY + degree

    let key = `${minX},${minY},${maxX.toFixed(degreeExp)},${maxY.toFixed(degreeExp)}`
    return key
  }
}

Pane.CENTER = CENTER
Pane.TOP = TOP
Pane.RIGHT = RIGHT
Pane.BOTTOM = BOTTOM
Pane.LEFT = LEFT

module.exports = Pane
