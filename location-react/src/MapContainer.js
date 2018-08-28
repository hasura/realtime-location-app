import React, { Component } from 'react';
import {Map, Marker, GoogleApiWrapper} from 'google-maps-react';

import {
  GOOGLE_API_KEY,
  HASURA_LOCATION
} from './constants'

export class MapContainer extends Component {
  render() {
    let markerLocation = null;

    const markerLocationPoint = this.props.marker_location;
    if (markerLocationPoint) {
      const markerLocationSplit = markerLocationPoint.replace(/[()]/g, "").split(",").map(x => x.trim());

      markerLocation = {
        lat: markerLocationSplit[0],
        lng: markerLocationSplit[1]
      };
    }

    return (
      <Map google={this.props.google}
           className="map"
           initialCenter={HASURA_LOCATION}
           zoom={16}>
        <Marker
          title={'Driver position: ' + markerLocationPoint}
          name={'Driver position'}
          position={markerLocation} />
      </Map>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: GOOGLE_API_KEY
})(MapContainer)