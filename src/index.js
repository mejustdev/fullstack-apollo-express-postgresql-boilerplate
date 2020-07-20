const { ApolloServer, gql } = require('apollo-server-express');
import cors from 'cors';
import 'dotenv/config';
const express = require('express');

const app = express();
app.use(cors());

let users = {
  1: {
    id: '1',
    username: 'Mehmet E.',
  },
  2: {
    id: '2',
    username: 'Dave Davids',
  },
};

const me = users[1];

const schema = gql`
  type Query {
    users: [User!]
    me: User
    user(id: ID!): User
  }
  type User {
    id: ID!
    username: String!
  }
`;

const resolvers = {
  Query: {
    users: () => {
      return Object.values(users);
    },
    user: (parent, { id }) => {
      return users[id];
    },
    me: () => {
      return me;
    },
  },
};

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
});

server.applyMiddleware({ app, path: '/graphql' });

app.listen({ port: 8000 }, () => {
  console.log('Apollo Server on http://localhost:8000/graphql');
});
