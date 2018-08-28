import React, {Component} from 'react';
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
      driverId: props.match.params.id,
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
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Realtime location tracking example</h1>
        </header>
        <div className="container">
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

                  return (
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
                  );
                }}
              </Subscription>
            )}
          </ApolloConsumer>
        </div>.
      </div>
    );
  }
}

const ApolloWrappedComponent = (props) => {
  return (
    <ApolloProvider client={client}>
      <App { ...props }/>
    </ApolloProvider>
  );
};

export default ApolloWrappedComponent;
