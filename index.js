const { Keystone } = require('@keystonejs/keystone');
const { PasswordAuthStrategy } = require('@keystonejs/auth-password');
const { GraphQLApp } = require('@keystonejs/app-graphql');
const { AdminUIApp } = require('@keystonejs/app-admin-ui');
const initialiseData = require('./initial-data');
const { createLists } = require('./lists');
require('dotenv').config();

const { MongooseAdapter: Adapter } = require('@keystonejs/adapter-mongoose');
const PROJECT_NAME = 'spotification';

const keystone = new Keystone({
  name: PROJECT_NAME,
  adapter: new Adapter(),
  onConnect: initialiseData
});

createLists(keystone);
const authStrategy = keystone.createAuthStrategy({
  type: PasswordAuthStrategy,
  list: 'Admin'
});

module.exports = {
  keystone,
  apps: [
    new GraphQLApp(),
    new AdminUIApp({
      enableDefaultRoute: true,
      authStrategy
    })
  ]
};
