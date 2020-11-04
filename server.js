const express = require("express");
const { graphqlHTTP } = require('express-graphql');  //Need to use destructuring assignment here to assign the function
const schema = require('./schema.js');
const cors = require('cors');

const app = express();

app.use( cors() ); //We know why we need this

//Basic integration of our schema with Graph QL - Route all requests on /graphql to GraphQL
app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));