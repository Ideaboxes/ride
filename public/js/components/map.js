import React from 'react'
import turf from 'turf'
import simpleheat from 'simpleheat'
import mapheat from 'mapheat'

class Map extends React.Component {

  constructor(props) {
    super(props)

    this.state = { size: 3000 }
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

    fetch('/data')
      .then(response => response.json())
      .then(json => {
        let points = json.filter(points => {
          return !points.last
        })

        let begin = +new Date()
        let pane = new mapheat()
        pane.import(points)

        pane.blocks().forEach(block => {
          let canvas = pane.draw(block)

          // TODO: This have to adjust to the degree add on the top
          let se = L.latLng(block.bounds.canvas.min.y, block.bounds.canvas.max.x)
            , sw = L.latLng(block.bounds.canvas.min.y, block.bounds.canvas.min.x)
            , ne = L.latLng(block.bounds.canvas.max.y, block.bounds.canvas.max.x)
            , nw = L.latLng(block.bounds.canvas.max.y, block.bounds.canvas.min.x)
          L.imageOverlay(canvas.toDataURL(), L.latLngBounds(sw, ne)).addTo(map)
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
