import React from 'react'
import turf from 'turf'
import simpleheat from 'simpleheat'

class Map extends React.Component {

  constructor(props) {
    super(props)

    this.state = { size: 3000 }
  }

  componentDidMount() {
    L.mapbox.accessToken = "pk.eyJ1IjoibGx1biIsImEiOiI0NzZjNDE3N2I1YWEwNWVjOGZjZDUzY2IxZmY3Y2MzOCJ9.Sj_jgKyAatQFDirVDM8jZw"
    let map = L.mapbox.map(this.refs.map, "llun.nhpgpcn0", { maxZoom: 15 })
      , extent = [103.6, 1.2, 104.2, 1.6]
      , cellWidth = 0.1
      , units = 'degrees'
      , southWest = L.latLng(extent[1], extent[0])
      , northEast = L.latLng(extent[3], extent[2])
      , bounds = L.latLngBounds(southWest, northEast)
      , squareGrid = turf.squareGrid(extent, cellWidth, units)
      , features = squareGrid.features

    map.on('zoomend', e => {
      console.log (map.getZoom())
      console.log (map.getBounds())
    })

    let polygons = features
      .map(feature => {
        let coordinates = feature.geometry.coordinates[0]
        coordinates.forEach((coordinate, index) => {
          coordinates[index] = L.latLng(coordinate[1], coordinate[0])
        })
        return coordinates
      })

    // polygons.forEach(polygon => {
    //   L.polygon(polygon, { weight: 1 }).addTo(map)
    // })
    map.fitBounds(bounds)

    this.draw(map)
  }

  // Draw an overlay
  draw(map) {

    let blockSize = 0.1
      , canvasSize = this.state.size
      , trimLength = blockSize.toString().length - 1

    let canvas = this.refs.canvas
      , cropCanvas = this.refs.cropCanvas
      , heat = simpleheat(canvas)

    heat.radius(2, 3)

    const CENTER_BOX = 0
      , TOP_BOX = 1
      , RIGHT_BOX = 2
      , BOTTOM_BOX = 3
      , LEFT_BOX = 4

    let getKey = (point, box = CENTER_BOX) => {
      // Alter the key base on the box
      let pLongitude = point.longitude
        , pLatitude = point.latitude

      switch (box) {
        case TOP_BOX:
          pLatitude += blockSize
          break
        case RIGHT_BOX:
          pLongitude += blockSize
          break
        case BOTTOM_BOX:
          pLatitude -= blockSize
          break
        case LEFT_BOX:
          pLatitude -= blockSize
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
        , maxX = (pLongitude + blockSize).toString().substring(0, longitudeTrimPoint)
        , minY = latitude.substring(0, latitudeTrimPoint)
        , maxY = (pLatitude + blockSize).toString().substring(0, latitudeTrimPoint)

      let key = `${minX},${minY},${maxX},${maxY}`
      return key
    }

    let getBound = key => {
      let [ minX, minY, maxX, maxY ] = key.split(',').map(item => { return parseFloat(item) })

      // Create all bounds points
      let nw = turf.point([minX, maxY])
        , ne = turf.point([maxX, maxY])
        , sw = turf.point([minX, minY])
        , se = turf.point([maxX, minY])

      // Calculate all distance for bound
      let km1 = turf.distance(nw, ne)
        , km2 = turf.distance(nw, sw)
        , km3 = turf.distance(sw, se)
        , km4 = turf.distance(ne, se)

      // Calculate radians
      let radians = Math.asin((km3 - km1)/km2)

      // Recalculate for bigger canvas
      let canvasMinX = minX - blockSize
        , canvasMaxX = maxX + blockSize
        , canvasMinY = minY - blockSize
        , canvasMaxY = maxY + blockSize

      let cnw = turf.point([canvasMinX, canvasMaxY])
        , cne = turf.point([canvasMaxX, canvasMaxY])
        , csw = turf.point([canvasMinX, canvasMinY])
        , cse = turf.point([canvasMaxX, canvasMinY])

      let ckm1 = turf.distance(cnw, cne)
        , ckm2 = turf.distance(cnw, csw)
        , ckm3 = turf.distance(csw, cse)
        , ckm4 = turf.distance(cne, cse)

      let cradians = Math.asin((ckm3 - ckm1)/ckm2)

      return {
        radians: radians,
        minX: minX,
        minY: minY,
        maxX: maxX,
        maxY: maxY,
        size: km3,

        canvas: {
          radians: cradians,
          minX: canvasMinX,
          minY: canvasMinY,
          maxX: canvasMaxX,
          maxY: canvasMaxY,
          size: ckm3
        }
      }
    }

    fetch('/data')
      .then(response => response.json())
      .then(json => {
        let points = json.filter(points => {
          return !points.last
        })

        let begin = +new Date()
        let blocks = points.reduce((result, point) => {
          let key = getKey(point)
            , topKey = getKey(point, TOP_BOX)
            , leftKey = getKey(point, LEFT_BOX)
            , bottomKey = getKey(point, BOTTOM_BOX)
            , rightKey = getKey(point, RIGHT_BOX)
            , keys = [key, topKey, leftKey, bottomKey, rightKey]

          keys.forEach(item => {
            if (!result[item]) {
              result[item] = {
                points: [],
                all: [],
                allKeys: {},
                bounds: getBound(item)
              }
            }

            // Try to avoid adding duplicate point
            if (!result[item].allKeys[point.id]) {
              result[item].all.push(point)
              result[item].allKeys[point.id] = true
            }

          })

          result[key].points.push(point)
          return result
        }, {})

        Object.keys(blocks).forEach(key => {
          let block = blocks[key]
            , points = block.all
            , bounds = block.bounds

          // Don't draw the box that doesn't have it own points
          if (block.points.length == 0) return

          // Clean the canvas before redraw heatmap
          let context = canvas.getContext('2d')
          context.clearRect(0, 0, canvas.width, canvas.height)

          let data = points.map(point => {
            let origin = turf.point([point.longitude, point.latitude])
              , originLeft = turf.point([bounds.canvas.minX, point.latitude])
              , originBottom = turf.point([point.longitude, bounds.canvas.minY])
              , q1 = turf.distance(originLeft, origin)
              , q3 = turf.distance(origin, originBottom)
              , q2 = q3 * Math.sin(bounds.canvas.radians)
              , q4 = q3 * Math.cos(bounds.canvas.radians)
              , x = Math.round(((q1 + q2) / bounds.canvas.size) * canvasSize)
              , y = canvasSize - Math.round(q4 / bounds.canvas.size * canvasSize)
            return [x, y, 0.01]
          })
          heat.data(data)
          heat.draw()
          console.log (canvas.toDataURL())

          // Crop the map for specific part
          let cropContext = cropCanvas.getContext('2d')
          cropContext.clearRect(0, 0, cropCanvas.width, cropCanvas.height)
          cropContext.drawImage(canvas, 1000, 1000, 1000, 1000, 0, 0, 1000, 1000)
          console.log (cropCanvas.toDataURL())

          // TODO: This have to adjust to the degree add on the top
          let se = L.latLng(bounds.minY, bounds.maxX)
            , sw = L.latLng(bounds.minY, bounds.minX)
            , ne = L.latLng(bounds.maxY, bounds.maxX)
            , nw = L.latLng(bounds.maxY, bounds.minX)
          L.imageOverlay(cropCanvas.toDataURL(), L.latLngBounds(sw, ne)).addTo(map);

        })
        // End renders all blocks
        let end = +new Date()
        console.log(end-begin)

      })
  }

  render() {
    let cropCanvasSize = this.state.size / 3
      , canvasStyle = { display: 'none' }

    return (
      <div className="map">
        <div ref="map" style={{ flex: 1 }}></div>
        <canvas ref="canvas" width={this.state.size} height={this.state.size} style={canvasStyle}></canvas>
        <canvas ref="cropCanvas" width={cropCanvasSize} height={cropCanvasSize} style={canvasStyle}></canvas>
      </div>
    )
  }

}
export default Map
