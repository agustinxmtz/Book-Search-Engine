//export the typeDefs and the resolvers to make them more easily accessed in other files.

const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');

module.exports = {typeDefs, resolvers};