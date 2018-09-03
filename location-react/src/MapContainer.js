import React, { Component } from 'react';

import GoogleMapReact from 'google-map-react';

import { fitBounds } from 'google-map-react/utils';

import {
  GOOGLE_API_KEY,
  bounds
} from './constants'

class Marker extends Component {
  render() {
    const greatPlaceStyle = {
      position: 'absolute',
      top: "100%",
      left: "50%",
      transform: 'translate(-50%, -50%)'
    };
    const divStyle = {
      'background':'#ffff00',
      'borderRadius':'50%',
      'border': '3px solid black',
      'padding': '2px',
      'height':'30px',
      'width':'30px',
      'position':'relative',
    };
    return (
      <div style={ greatPlaceStyle }>
        <div style={ divStyle }>
        </div>
      </div>
    );
  }
}

export class MapContainer extends Component {
  constructor() {
    super();
    this.state = {};
    this.state.mapLoaded = false;
  }
	handleGoogleMapApi = (google) => {
    this.setState({ ...this.state, ...google, mapLoaded: true});
    var directionsService = new google.maps.DirectionsService();
    directionsService.route({
      origin: new google.maps.LatLng(12.9395804,77.62047489999999),
      destination: new google.maps.LatLng(12.9339364,77.61086039999999),
			waypoints: [{
				stopover: false,
				location: new google.maps.LatLng(12.9400201,77.6207663)
			},
			{
				stopover: false,
				location: new google.maps.LatLng(12.940464,77.62026399999999)
			},
			{
				stopover: false,
				location: new google.maps.LatLng(12.9343753,77.6124028)
			},
			{
				stopover: false,
				location: new google.maps.LatLng(12.9316953,77.61384169999999)
			},
			{
				stopover: false,
				location: new google.maps.LatLng(12.9295913,77.61517739999999)
			},
			{
				stopover: false,
				location: new google.maps.LatLng(12.9311553,77.6098449)
			},
			{
				stopover: false,
				location: new google.maps.LatLng(12.9346852,77.60970669999999)
			},
			],
      travelMode: google.maps.TravelMode.DRIVING
    }, function(response, status) {
			if (status === google.maps.DirectionsStatus.OK) {
				var polyline = new google.maps.Polyline({
					path: [],
					strokeColor: '#0000FF',
					strokeWeight: 8
				});
				var bounds = new google.maps.LatLngBounds();

				var legs = response.routes[0].legs;
				for (var i = 0; i < legs.length; i++) {
					var steps = legs[i].steps;
					for (var j = 0; j < steps.length; j++) {
						var nextSegment = steps[j].path;
						for (var k = 0; k < nextSegment.length; k++) {
							polyline.getPath().push(nextSegment[k]);
							bounds.extend(nextSegment[k]);
						}
					}
				}

				polyline.setMap(google.map);
			} else {
				window.alert('Directions request failed due to ' + status);
			}
		});
	}
  render() {
    let markerLocation = null;

    const markerLocationPoint = this.props.marker_location;
    if (markerLocationPoint) {
      const markerLocationSplit = markerLocationPoint.replace(/[()]/g, "").split(",").map(x => x.trim());

      markerLocation = {
        lat: parseFloat(markerLocationSplit[0]),
        lng: parseFloat(markerLocationSplit[1])
      };
    }

    const size = {
      width: 320, // map width in pixels
      height: 400, // map height in pixels
    };

    const {center, zoom} = fitBounds(bounds, size);
    return (
      <div style={{height: '100%'}}>
        <GoogleMapReact
          bootstrapURLKeys={
            {
              key: GOOGLE_API_KEY
            }
          }
          center={center} 
          zoom={zoom}
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={this.handleGoogleMapApi}
        > 
          <Marker lat={markerLocation.lat} lng={markerLocation.lng} />
        </GoogleMapReact>
      </div>
    );
  }
}

export default MapContainer;
