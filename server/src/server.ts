import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { execute, subscribe } from 'graphql';
import depthLimit from 'graphql-depth-limit';
import { createServer } from 'http';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import compression from 'compression';
import cors from 'cors';
import schema from './schema';

const PORT = 3000;

const app = express();
const server = new ApolloServer({
  schema,
  validationRules: [depthLimit(7)],
  
  subscriptions: {
      keepAlive: 5000, 
  }
});

app.use('*', cors());
app.use(compression());

server.applyMiddleware({ app, path: '/graphql' });

const ws = createServer(app);
ws.listen(PORT, () => {
  console.log(`Apollo Server is now running on http://localhost:${PORT}`);
  // Set up the WebSocket for handling GraphQL subscriptions
  new SubscriptionServer({
    execute,
    subscribe,
    schema
  }, {
    server: ws,
    path: '/subscriptions',
  });
});