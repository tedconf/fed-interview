import { GraphQLClient } from 'graphql-request';

const API_URL = import.meta.env.DEV
  ? 'http://localhost:5173/api/graphql'
  : 'https://graphql.ted.com/graphql';

export const graphqlClient = new GraphQLClient(API_URL, {
  headers: {
    'Content-Type': 'application/json',
  },
});
