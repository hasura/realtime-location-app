import React, {Component} from 'react';
import { ApolloConsumer, Subscription } from 'react-apollo';
import gql from 'graphql-tag';

import client from './apollo'
import { ApolloProvider } from 'react-apollo';

import App from './App';

class Driver extends Component {
  constructor() {
    super();
    this.state = {};
    this.loadDriverInfo = this.loadDriverInfo.bind(this);
    this.driverId = 0;
  }
  loadDriverInfo(e) {
    const driverId = e.target.getAttribute('data-driver-id');
    if ( driverId ){
      this.setState({ ...this.state, driverId: parseInt(driverId, 10)});
    }
  }
  render() {
    const GET_USERS = gql`
        subscription {
          driver {
            id
            name
            vehicle_number
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
              <Subscription subscription={GET_USERS}>
                {({ loading, error, data }) => {
                  if (loading) return <p>Loading...</p>;
                  if (error) return <p>Error!</p>;

                  const driverCss = {
                    'cursor': 'pointer',
                    'textDecoration': 'underline',
                    'color': '#337ab7',
                  };

                  const listOfDriversCss = {
                    'width': '30%',
                    'float': 'left',
                  };
                  const headingCss = {
                    'display': 'inline-block',
                  };
                  const driverText = {
                    'fontSize': '12px',
                    'display': 'inline-block',
                    'fontWeight': 500,
                    'marginBottom': '20px',
                  };
                  const highlightRow = {
                    'background': '#eec',
                  };

                  const drivers = data.driver.map((d, index) =>
                    <tr style={ this.state.driverId === d.id ? highlightRow : {} } key={ index }>
                      <th scope="row">{ index + 1 }</th>
                      <td ><span data-driver-id={ d.id } style={ driverCss } onClick={ this.loadDriverInfo.bind(this) }>{ d.name }</span></td>
                      <td>{ d.vehicle_number }</td>
                    </tr>
                  );

                  return (
                    <div style={ listOfDriversCss } className="list_of_drivers">
                      <h3 style={ headingCss }>
                        Active drivers
                      </h3>
                      <div style={ driverText }>
                        (Driver location is updated every 5 secs to simulate live tracking)
                      </div>
                      <div className="row">
                        <table className="table">
                          <thead>
                            <tr>
                              <th scope="col">#</th>
                              <th scope="col">Name</th>
                              <th scope="col">Vehicle Number</th>
                            </tr>
                          </thead>
                          <tbody>
                            { drivers }
                          </tbody>
                        </table>
                      </div>
                    </div>
                  );
                }}
              </Subscription>
            )}
          </ApolloConsumer>
          { this.state.driverId ?
            <App driverId={ this.state.driverId } />
            :
            ''
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
