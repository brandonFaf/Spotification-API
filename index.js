const { Keystone } = require('@keystonejs/keystone');
const { PasswordAuthStrategy } = require('@keystonejs/auth-password');
const { GraphQLApp } = require('@keystonejs/app-graphql');
const { AdminUIApp } = require('@keystonejs/app-admin-ui');
const initialiseData = require('./initial-data');
const { createLists } = require('./lists');
const graphQLSchema = require('./gql/extendedSchema');
const configureExpress = require('./server');
require('dotenv').config();

const { MongooseAdapter: Adapter } = require('@keystonejs/adapter-mongoose');
const PROJECT_NAME = 'spotification';
global.super_access_token =
  'BQDJDPsB0XmIrD3z-mf07dFxt1aaaM38X_b9fDUxstF417_nKC5I3NKXU6tzaw9XoeoGJ2lbs2UbK1TlOO2nLpkzfoxl4HDwgw1sfj29iYttoZ879CUyYXLvSFQUAOCrLIequvXeT9XPYY2uSpaAZQXQKVgpxT66c_wNzoeUrC8er8lF3A';

const keystone = new Keystone({
  name: PROJECT_NAME,
  adapter: new Adapter()
  // onConnect: initialiseData
});

createLists(keystone);
const authStrategy = keystone.createAuthStrategy({
  type: PasswordAuthStrategy,
  list: 'Admin'
});

keystone.extendGraphQLSchema(graphQLSchema);

module.exports = {
  keystone,
  configureExpress,
  apps: [
    new GraphQLApp(),
    new AdminUIApp({
      enableDefaultRoute: true,
      authStrategy
    })
  ]
};
