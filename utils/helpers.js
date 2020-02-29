const request = require('request-promise'); // "Request" library
const { client_id, client_secret } = require('../config/keys');
module.useRefreshToken = async refresh_token => {
  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(
        `${client_id}:${client_secret}`
      ).toString('base64')}`
    },
    form: {
      grant_type: 'refresh_token',
      refresh_token
    },
    json: true
  };
  const result = await request(authOptions).catch(e => {
    console.log('e:', e);
  });

  super_access_token = result.access_token;
};
