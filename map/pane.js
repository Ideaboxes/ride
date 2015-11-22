'use strict'

let turf = require('turf')
  , canvas = require('canvas')
  , simpleheat = require('simpleheat')
  , util = require('./util')
  , Image = canvas.Image

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
      radians: radians,
      size: km3
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

  draw(block) {
    let size = this.options.size
      , pane = new canvas(size, size)
      , heat = simpleheat(pane)
      , context = pane.getContext('2d')

    heat.radius(2, 3)

    let data = Array.from(block.all).map(point => {
      let origin = turf.point([point.longitude, point.latitude])
        , originLeft = turf.point([block.bounds.min.x, point.latitude])
        , originBottom = turf.point([point.longitude, block.bounds.min.y])
        , q1 = turf.distance(originLeft, origin)
        , q3 = turf.distance(origin, originBottom)
        , q2 = q3 * Math.sin(block.bounds.radians)
        , q4 = q3 * Math.cos(block.bounds.radians)

        // Adjust x coordinate error because of length between two point in northen(/southern) are shorter than in equator
        , x = Math.round(((q1 + q2) / block.bounds.size) * size)
        , y = size - Math.round(q4 / block.bounds.size * size)
      return [x, y, 0.01]
    })
    heat.data(data)
    heat.draw()

    let cropSize = size / 3
      , crop = new canvas(cropSize, cropSize)
      , cropContext = crop.getContext('2d')

    cropContext.drawImage(pane, cropSize, cropSize, cropSize, cropSize, 0, 0, cropSize, cropSize)
    return crop
  }
}

Pane.CENTER = CENTER
Pane.TOP = TOP
Pane.RIGHT = RIGHT
Pane.BOTTOM = BOTTOM
Pane.LEFT = LEFT

module.exports = Pane
