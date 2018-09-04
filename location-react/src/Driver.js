import React, {Component} from 'react';

import { httpurl } from './apollo';
import { ApolloConsumer, Subscription } from 'react-apollo';
import gql from 'graphql-tag';

import client from './apollo'
import { ApolloProvider } from 'react-apollo';

import uuidv4 from 'uuid/v4';
import App from './App';
import UserInfo from './UserInfo';
import locationData from './location';
import './Driver.css';

const { query } = require('graphqurl');


/* Start from the scratch */
/* Keep mutating the state until the page is refreshed or something */

class Driver extends Component {
  constructor() {
    super();
    this.state = {};
    this.loadDriverInfo = this.loadDriverInfo.bind(this);
    this.state.driverInfo = {};
    this.state.driverId = uuidv4();
    this.state.startTracking = false;
    this.state.delay = 3000;
    this.state.locationId = 0;
    this.state.pollId = -1;
  }
  updateLocation() {
    if (locationData.length === this.state.locationId) {
      this.setState({ ...this.state, locationId: 0 });
    }
    const insert_driver_location = gql`
      mutation insert_driver_location ($objects: [driver_location_insert_input!]! )  {
        insert_driver_location (objects: $objects){
          returning {
            id
          }
        }
      }
    `;
    const variables = {
      "objects": [
        {
          "driver_id": this.state.driverId,
          "location": locationData[this.state.locationId],
        }
      ]
    };
    query(
      {
        query: insert_driver_location,
        endpoint: httpurl,
        variables: { ...variables },
      }
    ).then((response) => {
      this.setState({ ...this.state, locationId: this.state.locationId + 1});

    })
    .catch((error) => console.error(error));
  }
  loadDriverInfo(e) {
    const driverId = e.target.getAttribute('data-driver-id');
    if ( driverId ){
      this.setState({ ...this.state, driverId: parseInt(driverId, 10)});
    }
  }
  handleTrackLocationClick() {
    const insert_driver = gql`
      mutation insert_driver ($objects: [driver_insert_input!]! )  {
        insert_driver (objects: $objects){
          returning {
            id
          }
        }
      }
    `;
    const variables = {
      "objects": [
        {
          "id": this.state.driverId,
          "name": this.state.driverId,
        }
      ]
    };
    query(
      {
        query: insert_driver,
        endpoint: httpurl,
        variables: { ...variables },
      }
    ).then((response) => {
      console.log(response)
      this.setState({ ...this.state, startTracking: true });
      const pollId = setInterval(this.updateLocation.bind(this), this.state.delay);
      this.setState({ ...this.state, pollId: pollId });
    }).catch((error) => console.error(error));
  }
  componentWillUnmount() {
    clearInterval(this.state.pollId);
  }
  render() {
    const GET_USERS = gql`
        subscription getDriver($driverId: String!) {
          driver (where: { id: { _eq: $driverId }}) {
            id
            name
          }
        }
    `;

    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Realtime location tracking example</h1>
        </header>
        <div className="container">

          { this.state.startTracking ?
            [
              <ApolloConsumer key={'1'}>
                {client => (
                  <Subscription subscription={GET_USERS} variables={{ driverId: this.state.driverId }}>
                    {({ loading, error, data }) => {
                      if (loading) return <p>Loading...</p>;
                      if (error) return <p>Error!</p>;

                      return (
                        <div className="list_of_drivers">
                          <h3>
                            Commuter Info
                          </h3>
                          <div className={ 'driver_text' }>
                            (Location is updated every 3 secs to simulate live tracking)
                          </div>
                          <div>
                            <b>Commuter ID</b>: { this.state.driverId }
                          </div>
                        </div>
                      );
                    }}
                  </Subscription>
                )}
              </ApolloConsumer>,
              <App key='2' driverId={ this.state.driverId } />
            ]
            :
            <UserInfo userId={ this.state.driverId } handleTrackLocationClick={ this.handleTrackLocationClick.bind(this) }/>
          }
        </div>
      </div>
    );
  }
}

const ApolloWrappedComponent = () => {
  return (
    <ApolloProvider client={client}>
      <Driver />
    </ApolloProvider>
  );
};

export default ApolloWrappedComponent;
