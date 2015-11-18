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
    let degree = this.options.degree
      , trimLength = degree.toString().length - 1

    // Alter the key base on the position
    let pLongitude = location.longitude
      , pLatitude = location.latitude

    switch (position) {
      case TOP:
        pLatitude += degree
        break
      case RIGHT:
        pLongitude += degree
        break
      case BOTTOM:
        pLatitude -= degree
        break
      case LEFT:
        pLongitude -= degree
        break
    }

    let longitude = pLongitude.toString() //x
      , latitude = pLatitude.toString() //y
      , longitudeTrimPoint = longitude.indexOf('.') + trimLength
      , latitudeTrimPoint = latitude.indexOf('.') + trimLength

    // min x, max x
    // min y, max y
    // x = 103.24153, min x = 103.2, max x = 103.3
    // y = 1.2314434, min y =1.2, max y = 1.3
    let minX = longitude.substring(0, longitudeTrimPoint)
      , maxX = (pLongitude + degree).toString().substring(0, longitudeTrimPoint)
      , minY = latitude.substring(0, latitudeTrimPoint)
      , maxY = (pLatitude + degree).toString().substring(0, latitudeTrimPoint)

    let key = `${minX},${minY},${maxX},${maxY}`
    return key
  }
}

Pane.CENTER = CENTER
Pane.TOP = TOP
Pane.RIGHT = RIGHT
Pane.BOTTOM = BOTTOM
Pane.LEFT = LEFT

module.exports = Pane
