import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './App.css';

import GoogleApiWrapper from "./MapContainer";
import { ApolloConsumer, Subscription } from 'react-apollo';
import gql from 'graphql-tag';

import client from './apollo'
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
                name
                vehicle_number
                locations(order_by: timestamp_desc, limit: 1) {
                    location
                    timestamp
                }
            }
        }
    `;

    return (
      <ApolloConsumer>
        {client => (
          <Subscription subscription={LOCATION_SUBSCRIPTION} variables={{driverId: this.state.driverId}}>
            {({ loading, error, data }) => {
              if (loading) return <p>Loading...</p>;
              if (error) return <p>Error!</p>;

              let latestLocation = null;
              const driver = data.driver[0];
              const latestLocationObject = driver.locations[0];
              if (latestLocationObject) {
                latestLocation = latestLocationObject.location;
              }
              const driverLocation = {
                'width': '60%',
                'float': 'right',
                'borderLeft': '1px solid #eee',
                'paddingLeft': '20px',
              };
              return (
                <div style={ driverLocation }>
                  <div className="row">
                    <div className="col-md-6">
                      <h4>Subscription response</h4>
                      <pre>
                        { JSON.stringify(data, null, 2) }
                      </pre>
                    </div>
                    <div className="col-md-6">
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
  driverId: PropTypes.number.isRequired,
};

const ApolloWrappedComponent = (props) => {
  return (
    <ApolloProvider client={client}>
      <App { ...props }/>
    </ApolloProvider>
  );
};

export default ApolloWrappedComponent;
