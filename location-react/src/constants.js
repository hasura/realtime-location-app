// Constants file

const GOOGLE_API_KEY = "AIzaSyDF0WN7OR1aJVA48G3GHkfLkxmmy6bDmdk"; // TODO: use Hasura key

const graphqlURL = 'realtime-backend.herokuapp.com/v1alpha1/graphql';

const wsurl = `ws://${ graphqlURL }`;
const httpurl = `https://${ graphqlURL }`;

const HASURA_LOCATION = {
  lat: 12.93958,
  lng: 77.62047,
  // lat: 12.939553,
  // lng: 77.620519
};

const bounds =  {
  "ne" : {
    "lat" : 12.940464,
    "lng" : 77.6207663
  },
  "sw" : {
    "lat" : 12.929445,
    "lng" : 77.60969620000002
  }
};

export {
  GOOGLE_API_KEY,
  HASURA_LOCATION,
  bounds,
  wsurl,
  httpurl,
};
