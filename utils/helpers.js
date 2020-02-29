const request = require('request-promise'); // "Request" library
const { client_id, client_secret } = require('../config/keys');
const useRefreshToken = async refresh_token => {
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
const generateRandomString = length => {
  let text = '';
  const possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};
module.exports = {
  generateRandomString,
  useRefreshToken
};
