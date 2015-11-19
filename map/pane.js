'use strict'

let turf = require('turf')
  , util = require('./util')

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
    this.blocks = {}
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

  bounds(key) {
    let keys = key.split(',').map(item => { return parseFloat(item) })
      , exp = Math.abs(+degree.toExponential().split('e')[1])

    let minX = +(keys[0] - degree).toFixed(exp)
      , maxX = +(keys[2] + degree).toFixed(exp)
      , minY = +(keys[1] - degree).toFixed(exp)
      , maxY = +(keys[3] + degree).toFixed(exp)

    let nw = turf.point([minX, maxY])
      , ne = turf.point([maxX, maxY])
      , sw = turf.point([minX, minY])
      , se = turf.point([maxX, maxY])

    let km1 = turf.distance(nw, ne)
      , km2 = turf.distance(nw, sw)
      , km3 = turf.distance(sw, se)
      , km4 = turf.distance(ne, se)

    let radians = Math.asin((km3 - km1) / km2)
    return {
      min: { x: minX, y: minY },
      max: { x: maxX, y: maxY },
      radians: radians
    }
  }

  addPoint(point, blocks) {
    let centerKey = this.key(point)
      , topKey = this.key(point, TOP)
      , leftKey = this.key(point, LEFT)
      , bottomKey = this.key(point, BOTTOM)
      , rightKey = this.key(point, RIGHT)
      , keys = [centerKey, topKey, leftKey, bottomKey, rightKey]

    keys.forEach(key => {
      if (!blocks[key]) {
        blocks[key] = {
          points: new Set(),
          all: new Set(),
          bounds: this.bounds(key)
        }
      }

      blocks[key].all.add(point)
      blocks[key].points.add(point)
    })
  }
}

Pane.CENTER = CENTER
Pane.TOP = TOP
Pane.RIGHT = RIGHT
Pane.BOTTOM = BOTTOM
Pane.LEFT = LEFT

module.exports = Pane
