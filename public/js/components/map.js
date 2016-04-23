import React, { Component } from 'react';
import { connect } from 'react-redux';
import turf from 'turf';
import Mapheat from 'mapheat';

import Activities from './activities';
import log from '../log';
import { MAPBOX_ACCESS_TOKEN, MAP_ID } from '../config';

class Map extends Component {

  constructor(props) {
    super(props);

    this.state = { size: 3000 };
  }

  componentDidMount() {
    L.mapbox.accessToken = MAPBOX_ACCESS_TOKEN;
    let map = L.mapbox.map(this.refs.map, MAP_ID);
    let extent = [103.6, 1.2, 104.2, 1.6];
    let cellWidth = 0.1;
    let units = 'degrees';
    let southWest = L.latLng(extent[1], extent[0]);
    let northEast = L.latLng(extent[3], extent[2]);
    let bounds = L.latLngBounds(southWest, northEast);
    let squareGrid = turf.squareGrid(extent, cellWidth, units);
    let features = squareGrid.features;

    map.on('zoomend', () => {
      log.log(map.getZoom());
      log.log(map.getBounds());
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
        log.log(end - begin);
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

        {(() => {
          if (this.props.user) {
            return <Activities />;
          }
          return null;
        })()}
      </div>
    );
  }

}

Map.propTypes = {
  user: React.PropTypes.object,
};

export default connect(state => ({ user: state.user }))(Map);
