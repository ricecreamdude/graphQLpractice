const { 
    GraphQLObjectType, 
    GraphQLInt, 
    GraphQLString, 
    GraphQLBoolean,
    GraphQLList,
    GraphQLSchema
 } = require('graphql');

const axios = require('axios');

//Creating a Type
//https://api.spacexdata.com/v3/launches
const LaunchType = new GraphQLObjectType({
    name:"Launch",
    fields: () => (
        {
            flight_number: { type: GraphQLInt },
            mission_name: { type: GraphQLString },
            launch_year: { type: GraphQLString },
            launch_date_local: { type: GraphQLString },
            launch_success: { type: GraphQLBoolean },
            rocket: { type: RocketType}
        }
    )
});

//Creating a type with a relationship
const RocketType = new GraphQLObjectType({
    name: "Rocket",
    fields: () => ({
        rocket_id: { type: GraphQLString },
        rocket_name: { type: GraphQLString },
        rocket_type: { type: GraphQLString }
    })
})

//Root Query
//Endpoints with Resolvers that 'resolve our data'
//This controlls what 'endpoints' we are using, as well as what types are associated to those endpoints
const RootQuery = new GraphQLObjectType({
    name: "RootQueryType",
    fields: () => ({
        launches:{
            type: new GraphQLList( LaunchType ), // Define the signature of the request
            resolve(parent, args) {
                return axios
                    .get('https://api.spacexdata.com/v3/launches')
                    .then( res => res.data );
            }
        },
        launch: {
            type: LaunchType,   //Define the signature of the request
            args: {
                flight_number: { type: GraphQLInt } //Define our arguments and their types
            },
            resolve(parent, args) {
                return axios
                    .get(`https://api.spacexdata.com/v3/launches/${args.flight_number}`)
                    .then( res => res.data ); //Insert our argument via template syntax
            }

        },
        rockets:{
            type: new GraphQLList( RocketType ),  //Remember 'new'
            resolve(parent, args ){
                return axios
                    .get(`https://api.spacexdata.com/v3/rockets`)
                    .then( res => res.data );
            }
        },
        rocket:{
            type: RocketType,
            args: {
                rocket_id: {type: GraphQLString}
            },
            resovlve(parent, args){
                return axios
                    .get(`https://api.spacexdata.com/v3/rockets/${rocket_id}`)
                    .then( res => res.data );
            }

        } //Partially completed endpoints will throw a cryptic error
    })
})

module.exports = new GraphQLSchema({
    query: RootQuery
})