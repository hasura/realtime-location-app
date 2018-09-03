import React, { Component } from 'react';

import GoogleMapReact from 'google-map-react';

import { fitBounds } from 'google-map-react/utils';

import {
  HASURA_LOCATION
} from './constants'

class Marker extends Component {
  render() {
    const divStyle = {
      'background':'#232e40',
      'borderRadius':'50%',
      'height':'20px',
      'width':'20px',
      'position':'relative',
      'bottom':'-10px',
    };
    return (
      <div>
        <div style={ divStyle }>
        </div>
      </div>
    );
  }
}

export class MapContainer extends Component {
	handleGoogleMapApi = (google) => {
    var directionsService = new google.maps.DirectionsService();
    directionsService.route({
      origin: new google.maps.LatLng(12.9396, 77.6205),
      destination: new google.maps.LatLng(12.939539,77.620593),
			waypoints: [{
				stopover: false,
				location: new google.maps.LatLng(12.939935,77.620707)
			},
			{
				stopover: false,
				location: new google.maps.LatLng(12.939902,77.620877)
			},
			{
				stopover: false,
				location: new google.maps.LatLng(12.939698,77.621067)
			},
			{
				stopover: false,
				location: new google.maps.LatLng(12.939363,77.621402)
			},
			{
				stopover: false,
				location: new google.maps.LatLng(12.939002,77.621641)
			},
			{
				stopover: false,
				location: new google.maps.LatLng(12.938782,77.621459)
			},
			],
      travelMode: google.maps.TravelMode.DRIVING
    }, function(response, status) {
			if (status === google.maps.DirectionsStatus.OK) {
				var polyline = new google.maps.Polyline({
					path: [],
					strokeColor: '#0000FF',
					strokeWeight: 3
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


    /*
		var flightPath = new google.maps.Polyline({
			path: [ {'lat': 12.939935, 'lng': 77.620707}, { 'lat': 12.939902, 'lng': 77.620877}],
			geodesic: true,
			strokeColor: '#33BD4E',
			strokeOpacity: 1,
			strokeWeight: 5
		});

		flightPath.setMap(google.map);
    */
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

    const bounds = {
      sw: { ...HASURA_LOCATION },
    };
    if ( markerLocation ) {
      bounds.ne = {
        ...markerLocation
      };
    }

    const size = {
      width: 320, // map width in pixels
      height: 400, // map height in pixels
    };
    const {center, zoom} = fitBounds(bounds, size);
    return (
      <GoogleMapReact
        center={center} 
        zoom={zoom ? zoom : 18}
        yesIWantToUseGoogleMapApiInternals
        onGoogleApiLoaded={this.handleGoogleMapApi}
      > 
        <Marker lat={markerLocation.lat} lng={markerLocation.lng} />
      </GoogleMapReact>
    );
  }
}

export default MapContainer;
