const types = require('./schema');
const { getPlaylistFromSpotify } = require('./resolvers/spotify');
module.exports = {
  types,
  queries: [
    {
      schema: `getPlaylistFromSpotify(id: ID!): SpotifyPlaylist`,
      resolver: getPlaylistFromSpotify
    }
  ]
};
