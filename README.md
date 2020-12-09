# Demo chat application

The original concept was to try and make two separate docker images that cna hook into a generic database image to store the chatlog.

Simple application should be able to be put together with a lightweight app structure so chose Svelte as it is fast and simple while having a lot of the modern power of frameworks

GraphQL is a very powerful server layer that has a lot of built-in cascading resoltion of data (eg users in messages) and inbuild support for realtime subscriptions through subscriptions, so seemed like a nice fit.

### Things that got done:

- ✔ GraphQL with in memory storage for chat logs and users
- ✔ Svelte app that lets you log in as a new user and post messages
- ✔ Subscriptions with web sockets for realtime updates

### Things that did not get done:

- ❌ Testing
- ❌ Dockerisation
- ❌ External database for storage
- ❌ DataLoaders for database connection
- ❌ Error handling in app

## Just get it running already!

Each section (`server` and `client`) should run `yarn build` to build the distribution version and `yarn start` to serve it.

Currently GraphQL is hosted on `http://localhost:3000` and the application is on `http://localhost:5000`. Obviously both need to be running or the client will complain.

### What about a dev build?

For dev work there is `yarn dev` in both that should start it up with a local watch for changes.