import React from 'react'

class Map extends React.Component {

  constructor(props) {
    super(props)
  }

  componentDidMount() {
    L.mapbox.accessToken = "pk.eyJ1IjoibGx1biIsImEiOiI0NzZjNDE3N2I1YWEwNWVjOGZjZDUzY2IxZmY3Y2MzOCJ9.Sj_jgKyAatQFDirVDM8jZw"
    L.mapbox.map(this.refs.map, "llun.nhpgpcn0")

    let mapbox = {
      key: "pk.eyJ1IjoibGx1biIsImEiOiI0NzZjNDE3N2I1YWEwNWVjOGZjZDUzY2IxZmY3Y2MzOCJ9.Sj_jgKyAatQFDirVDM8jZw",
      id: "llun.nhpgpcn0"
    }
  }

  render() {
    return (
      <div className="map" ref="map"></div>
    )
  }

}
export default Map
