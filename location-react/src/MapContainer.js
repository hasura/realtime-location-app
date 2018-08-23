import React, { Component } from 'react';
import {Map, Marker, GoogleApiWrapper} from 'google-maps-react';

import {
  GOOGLE_API_KEY,
  HASURA_LOCATION
} from './constants'

export class MapContainer extends Component {
  render() {
    console.log(this.props.marker_location); // TODO: remove

    return (
      <Map google={this.props.google}
           className="map"
           initialCenter={HASURA_LOCATION}
           zoom={14}>
        {/*<Marker*/}
          {/*title={'Hasura.io Office'}*/}
          {/*name={'hasura.io'}*/}
          {/*position={HASURA_LOCATION} />*/}
        <Marker
          title={'Moving marker'}
          name={'moving'}
          position={this.props.marker_location} />
      </Map>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: GOOGLE_API_KEY
})(MapContainer)