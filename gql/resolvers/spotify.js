/* eslint-disable no-undef */
const axios = require('axios');
const { useRefreshToken } = require('../../utils/helpers');
const { masterRefreshToken } = require('../../config/keys');

axios.interceptors.response.use(
  response => response,
  async error => {
    if (error.response.status === 401) {
      const originalRequest = error.config;
      console.log('trying again');
      // eslint-disable-next-line no-use-before-define
      await useRefreshToken(masterRefreshToken);
      originalRequest.headers.Authorization = `Bearer ${super_access_token}`;
      return axios(originalRequest);
    }
    return error;
  }
);

const getPlaylistFromSpotify = async (parent, args) => {
  const data = await axios.get(
    `https://api.spotify.com/v1/playlists/${args.id}`,
    {
      headers: {
        Authorization: `Bearer ${super_access_token}`
      }
    }
  );
  return data.data;
};
const getTracksFromSpotify = async href => {
  let joiner = '?';
  if (href.includes('?')) {
    joiner = '&';
  }
  return axios.get(
    `${href}${joiner}fields=items(added_at,added_by.id, track(name, id, artists(name)))`,
    {
      headers: {
        Authorization: `Bearer ${super_access_token}`
      }
    }
  );
};

module.exports = {
  getPlaylistFromSpotify,
  getTracksFromSpotify
};
