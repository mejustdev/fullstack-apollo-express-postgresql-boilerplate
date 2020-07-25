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

let messages = {
  1: {
    id: '1',
    text: 'Hello World',
  },
  2: {
    id: '2',
    text: 'By World',
  },
};

const schema = gql`
  type Query {
    users: [User!]
    me: User
    user(id: ID!): User

    messages: [Message!]!
    message(id: ID!): Message!
  }

  type User {
    id: ID!
    username: String!
  }

  type Message {
    id: ID!
    text: String!
    user: User!
  }
`;

// https://www.apollographql.com/docs/apollo-server/data/resolvers/#resolver-arguments

const resolvers = {
  Query: {
    users: () => {
      return Object.values(users);
    },
    // parent, args, context, info
    user: (parent, { id }) => {
      return users[id];
    },
    me: (parent, args, { me }) => {
      return me;
    },
    messages: () => {
      return Object.values(messages);
    },
    message: (parent, { id }) => {
      return messages[id];
    },
  },
  Message: {
    user: (parent, args, { me }) => {
      return me;
    },
  },
};

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  context: {
    me: users[1],
  },
});

server.applyMiddleware({ app, path: '/graphql' });

app.listen({ port: 8000 }, () => {
  console.log('Apollo Server on http://localhost:8000/graphql');
});
