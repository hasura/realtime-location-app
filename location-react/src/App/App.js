import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './App.css';

import GoogleApiWrapper from "./MapContainer";
import { ApolloConsumer, Subscription } from 'react-apollo';
import gql from 'graphql-tag';

import client from '../apollo'
import { ApolloProvider } from 'react-apollo';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      driverId: props.driverId,
    }
  }
  componentWillReceiveProps(nextProps) {
    if ( nextProps.driverId !== this.props.driverId ) {
      this.setState({ ...this.state, driverId: nextProps.driverId });
    }
  }
  render() {
    const LOCATION_SUBSCRIPTION = gql`
        subscription getLocation($driverId: Int!) {
            driver(where: {id: {_eq: $driverId}}) {
                locations(order_by: timestamp_desc, limit: 1) {
                    location
                    timestamp
                }
            }
        }
    `;

    const queryImg = require('../assets/carbon.png');

    return (
      <ApolloConsumer>
        {client => (
          <Subscription subscription={LOCATION_SUBSCRIPTION} variables={{driverId: this.props.driverId}}>
            {({ loading, error, data }) => {
              if (loading) return <p>Loading...</p>;
              if (error) return <p>Error! </p>;

              let latestLocation = null;
              const driver = data.driver[0];
              const latestLocationObject = driver.locations[0];
              if (latestLocationObject) {
                latestLocation = latestLocationObject.location;
              }
              const driverLocation = {
                'width': '100%',
                'marginBottom': '20px',
              };
              const queryImgStyle = {
                'width': '100%',
              };
              return (
                <div style={ driverLocation }>
                  <div className="row ">
                    <div className="col-md-6 col-xs-12 request_block">
                      <div className="subscription_wrapper">
                        <h4>Hasura Subscription request</h4>
                        <div className="subscription_query">
                          The GraphQL subscription query required to fetch the realtime location data is as below.
                        </div>
                        <div>
                          <img style={ queryImgStyle } src={ queryImg } alt="Subscription query"/>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6 col-xs-12">
                      <h4>Live tracking</h4>
                      <div className="map_wrapper">
                        <GoogleApiWrapper marker_location={latestLocation}/>
                      </div>
                    </div>
                  </div>
                </div>
              );
            }}
          </Subscription>
        )}
      </ApolloConsumer>
    );
  }
}

App.propTypes = {
  driverId: PropTypes.string.isRequired,
};

const ApolloWrappedComponent = (props) => {
  return (
    <ApolloProvider client={client}>
      <App { ...props }/>
    </ApolloProvider>
  );
};

export default ApolloWrappedComponent;
