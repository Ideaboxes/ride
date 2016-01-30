import React, { Component } from 'react';
import turf from 'turf';
import Mapheat from 'mapheat';

class Map extends Component {

  constructor(props) {
    super(props);

    this.state = { size: 3000 };
  }

  componentDidMount() {
    L.mapbox.accessToken = 'pk.eyJ1IjoibGx1biIsImEiOiI0NzZjNDE' +
      '3N2I1YWEwNWVjOGZjZDUzY2IxZmY3Y2MzOCJ9.Sj_jgKyAatQFDirVDM8jZw';
    let map = L.mapbox.map(this.refs.map, 'llun.nhpgpcn0');
    let extent = [103.6, 1.2, 104.2, 1.6];
    let cellWidth = 0.1;
    let units = 'degrees';
    let southWest = L.latLng(extent[1], extent[0]);
    let northEast = L.latLng(extent[3], extent[2]);
    let bounds = L.latLngBounds(southWest, northEast);
    let squareGrid = turf.squareGrid(extent, cellWidth, units);
    let features = squareGrid.features;

    map.on('zoomend', () => {
      console.log(map.getZoom());
      console.log(map.getBounds());
    });

    // let polygon = features.map(...)
    features
      .map(feature => {
        let coordinates = feature.geometry.coordinates[0];
        coordinates.forEach((coordinate, index) => {
          coordinates[index] = L.latLng(coordinate[1], coordinate[0]);
        });
        return coordinates;
      });

    // polygons.forEach(polygon => {
    //   L.polygon(polygon, { weight: 1 }).addTo(map)
    // })
    map.fitBounds(bounds);

    // this.draw(map)
  }

  // Draw an overlay
  draw(map) {
    fetch('/data')
      .then(response => response.json())
      .then(json => {
        let points = json.filter(item => !item.last);

        let begin = +new Date();
        let pane = new Mapheat();
        pane.import(points);

        pane.blocks().forEach(block => {
          let canvas = pane.draw(block);

          // TODO: This have to adjust to the degree add on the top
          // let se = L.latLng(block.bounds.canvas.min.y, block.bounds.canvas.max.x);
          let sw = L.latLng(block.bounds.canvas.min.y, block.bounds.canvas.min.x);
          let ne = L.latLng(block.bounds.canvas.max.y, block.bounds.canvas.max.x);
          // let nw = L.latLng(block.bounds.canvas.max.y, block.bounds.canvas.min.x);
          L.imageOverlay(canvas.toDataURL(), L.latLngBounds(sw, ne)).addTo(map);
        });

        // End renders all blocks
        let end = +new Date();
        console.log(end - begin);
      });
  }

  render() {
    let cropCanvasSize = this.state.size / 3;
    let canvasStyle = { display: 'none' };

    return (
      <div className="map">
        <div ref="map" style={{ flex: 1 }}></div>
        <canvas ref="canvas"
          width={this.state.size}
          height={this.state.size}
          style={canvasStyle}
        ></canvas>
        <canvas ref="cropCanvas"
          width={cropCanvasSize}
          height={cropCanvasSize}
          style={canvasStyle}
        ></canvas>
      </div>
    );
  }

}
export default Map;
