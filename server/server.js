const express = require('express');
const { authMiddleware } = require('./utils/auth');

// import Apollo Server
const {ApolloServer} = require('apollo-server-express');

// import our typedefs and resolvers
const {typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');

const PORT = process.env.PORT || 3001;

// create a new Apollo server and pass in out schema data.
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => req.headers
});

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Create a new instance of an Apollo server with the GraphQL schema
const startApolloServer = async (typeDefs, resolvers) => {
  await server.start();

  //integerate our Apollo server with the Express.js application as middleware
  server.applyMiddleware({app});

  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      // console log where we can go to test our GQL API.
      console.log(`Use GraphQL at http://127.0.0.1:${PORT}${server.graphqlPath}`);
    });
  });
};

// Call the async fucntion strart the server
startApolloServer(typeDefs, resolvers);


