import React, {Component} from 'react';
import { ApolloConsumer, Subscription } from 'react-apollo';
import gql from 'graphql-tag';

import client from './apollo'
import { ApolloProvider } from 'react-apollo';

class Driver extends Component {
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

                  const drivers = data.driver.map((d, index) =>
                    <tr key={ index }>
                      <th scope="row">{ index + 1 }</th>
                      <td><a href={ `/driver/${ d.id }` }>{ d.name }</a></td>
                      <td>{ d.vehicle_number }</td>
                    </tr>
                  );

                  return (
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
                  );
                }}
              </Subscription>
            )}
          </ApolloConsumer>
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
