const { ApolloServer } = require('apollo-server-express');
import cors from 'cors';
import 'dotenv/config';

import schema from './schema';
import resolvers from './resolvers';
import models from './models';

const express = require('express');

const app = express();
app.use(cors());

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  context: {
    models,
    me: models.users[1],
  },
});

server.applyMiddleware({ app, path: '/graphql' });

app.listen({ port: 8000 }, () => {
  console.log('Apollo Server on http://localhost:8000/graphql');
});
