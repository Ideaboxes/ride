import React from 'react'
import turf from 'turf'
import simpleheat from 'simpleheat'

class Map extends React.Component {

  constructor(props) {
    super(props)

    this.state = { size: 1000 }
  }

  componentDidMount() {
    L.mapbox.accessToken = "pk.eyJ1IjoibGx1biIsImEiOiI0NzZjNDE3N2I1YWEwNWVjOGZjZDUzY2IxZmY3Y2MzOCJ9.Sj_jgKyAatQFDirVDM8jZw"
    let map = L.mapbox.map(this.refs.map, "llun.nhpgpcn0")
      , extent = [103.6, 1.2, 104.2, 1.6]
      , cellWidth = 0.1
      , units = 'degrees'
      , southWest = L.latLng(extent[1], extent[0])
      , northEast = L.latLng(extent[3], extent[2])
      , bounds = L.latLngBounds(southWest, northEast)
      , squareGrid = turf.squareGrid(extent, cellWidth, units)
      , features = squareGrid.features

    let polygons = features
      .map(feature => {
        let coordinates = feature.geometry.coordinates[0]
        coordinates.forEach((coordinate, index) => {
          coordinates[index] = L.latLng(coordinate[1], coordinate[0])
        })
        return coordinates
      })

    polygons.forEach(polygon => {
      L.polygon(polygon, { weight: 1 }).addTo(map)
    })
    map.fitBounds(bounds)

    this.draw(map)
  }

  // Draw an overlay
  draw(map) {

    let left = 103.8
      , right = 103.9
      , bottom = 1.3
      , top = 1.4
      , blockSize = 0.1
      , canvasSize = this.state.size

    let point1 = turf.point([left, top])
      , point2 = turf.point([right, top])
      , point3 = turf.point([left, bottom])
      , point4 = turf.point([right, bottom])

    // Draw all points in grid [1.3, 103.8], [1.4, 103.9]
    let km = turf.distance(point1, point2)
      , km2 = turf.distance(point1, point3)
      , km3 = turf.distance(point3, point4)
      , km4 = turf.distance(point2, point4)
    console.log (km, km2, km3, km4)

    ///   1 - 2
    ///  /     \
    /// 3 - - - 4

    console.log (`Width ${km3} km`, `${km3 * 1000} m`)

    let canvas = this.refs.canvas
      , heat = simpleheat(canvas)

    heat.radius(2, 3)

    let radians = Math.asin((km3 - km)/km2)
    console.log (`z = ${km2}`, `x = ${(km3 - km) / 2}`, `radians = ${radians}`)


    let getKey = point => {
      let longitude = point.longitude.toString() //x
        , latitude = point.latitude.toString() //y
        , longitudeTrimPoint = longitude.indexOf('.') + 2
        , latitudeTrimPoint = latitude.indexOf('.') + 2

      // min x, max x
      // min y, max y
      // x = 103.24153, min x = 103.2, max x = 103.3
      // y = 1.2314434, min y =1.2, max y = 1.3
      let minX = longitude.substring(0, longitudeTrimPoint)
        , maxX = (point.longitude + 0.1).toString().substring(0, longitudeTrimPoint)
        , minY = latitude.substring(0, latitudeTrimPoint)
        , maxY = (point.latitude + 0.1).toString().substring(0, latitudeTrimPoint)

      let key = `${minX},${minY},${maxX},${maxY}`
      return key
    }

    let getBound = key => {
      let [ minX, minY, maxX, maxY ] = key.split(',')
      console.log (key.split(','))

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
      return {
        radians: radians,
        minX: parseFloat(minX),
        minY: parseFloat(minY),
        maxX: parseFloat(maxX),
        maxY: parseFloat(maxY),
        size: km3
      }
    }

    fetch('/data')
      .then(response => response.json())
      .then(json => {
        let points = json.filter(points => {
          return !points.last
        })

        let blocks = points.reduce((result, point) => {
          let key = getKey(point)

          if (!result[key]) {
            result[key] = {
              points: [],
              bounds: getBound(key)
            }
          }

          result[key].points.push(point)

          return result
        }, {})

        Object.keys(blocks).forEach(key => {
          let block = blocks[key]
            , points = block.points
            , bounds = block.bounds

          // Clean the canvas before redraw heatmap
          let context = canvas.getContext('2d')
          context.clearRect(0, 0, canvas.width, canvas.height)

          let data = points.map(point => {
            let origin = turf.point([point.longitude, point.latitude])
              , originLeft = turf.point([bounds.minX, point.latitude])
              , originBottom = turf.point([point.longitude, bounds.minY])
              , q1 = turf.distance(originLeft, origin)
              , q3 = turf.distance(origin, originBottom)
              , q2 = q3 * Math.sin(radians)
              , q4 = q3 * Math.cos(radians)
              , x = Math.round(((q1 + q2) / bounds.size) * canvasSize)
              , y = canvasSize - Math.round(q4 / bounds.size * canvasSize)
            return [x, y, 0.01]
          })
          heat.data(data)
          heat.draw()

          // TODO: This have to adjust to the degree add on the top
          let sw = L.latLng(bounds.minY, bounds.minX)
            , ne = L.latLng(bounds.maxY, bounds.maxX)
          L.imageOverlay(canvas.toDataURL(), L.latLngBounds(sw, ne)).addTo(map);
        })
        // End renders all blocks

      })
  }

  render() {
    return (
      <div className="map">
        <div ref="map" style={{ flex: 1 }}></div>
        <canvas ref="canvas" width={this.state.size} height={this.state.size} style={{ display: "none" }}></canvas>
      </div>
    )
  }

}
export default Map
