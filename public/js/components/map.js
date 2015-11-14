import React from 'react'
import turf from 'turf'
import simpleheat from 'simpleheat'

class Map extends React.Component {

  constructor(props) {
    super(props)

    this.state = { size: 640 }
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

    fetch('/data')
      .then(response => response.json())
      .then(json => {

        let data = json
          .filter(point => {
            // Don't process in this sqaure box, make it more simple first
            if (json.longitude < left || json.longitude > right ||
              json.latitude > top || json.latitude < bottom) return false
            return true
          })
          .map(point => {
            let x = Math.round((0.2 * Math.sin(radians) + (point.longitude - left)) * canvasSize)
              , y = canvasSize - Math.round((Math.cos(radians) * (point.latitude - bottom)) * canvasSize)
            return [x, y, 0.01]
          })
        heat.data(data)
        heat.draw(0.05)

        let sw = L.latLng(bottom, left)
          , ne = L.latLng(top, right)
        L.imageOverlay(canvas.toDataURL(), L.latLngBounds(sw, ne)).addTo(map);

        console.log (canvas.toDataURL())
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
