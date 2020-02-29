const request = require('request'); // "Request" library
const querystring = require('querystring');
const express = require('express');
const cookieParser = require('cookie-parser');
const { client_id, client_secret, redirect_uri } = require('./config/keys');
const { useRefreshToken, generateRandomString } = require('./utils/helpers');
// const { createUser } = require('./user');

const stateKey = 'spotify_auth_state';

const router = express.Router();

router.get('/login', (req, res) => {
  const state = generateRandomString(16);
  res.cookie(stateKey, state);

  // your application requests authorization
  const scope =
    'user-read-private user-read-email playlist-read-private playlist-read-collaborative';
  res.redirect(
    `https://accounts.spotify.com/authorize?${querystring.stringify({
      response_type: 'code',
      client_id,
      scope,
      redirect_uri,
      state
    })}`
  );
});

router.get('/callback', (req, res) => {
  // your application requests refresh and access tokens
  // after checking the state parameter

  const code = req.query.code || null;
  const state = req.query.state || null;
  const storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    res.redirect(
      `/#${querystring.stringify({
        error: 'state_mismatch'
      })}`
    );
  } else {
    res.clearCookie(stateKey);
    const authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code,
        redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${client_id}:${client_secret}`
        ).toString('base64')}`
      },
      json: true
    };

    request.post(authOptions, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        const { access_token, refresh_token } = body;
        global.super_access_token = access_token;

        // const options = {
        //   url: 'https://api.spotify.com/v1/me',
        //   headers: { Authorization: `Bearer ${access_token}` },
        //   json: true
        // };
        res.json({ access_token, refresh_token });
        // use the access token to access the Spotify Web API
        // request.get(options, (e, r, { id }) => {
        //   createUser(id);
        //   res
        //     .cookie('access_token', access_token)
        //     .cookie('refresh_token', refresh_token)
        //     .redirect(
        //       `http://localhost:3000/dashboard?${querystring.stringify({
        //         access_token,
        //         refresh_token,
        //         id
        //       })}`
        //     );
        // });
      } else {
        res.redirect(
          `/#?${querystring.stringify({
            error: 'invalid_token'
          })}`
        );
      }
    });
  }
});

router.get('/refresh_token', async (req, res) => {
  // requesting access token from refresh token
  const { refresh_token } = req.query;
  const access_token = await useRefreshToken(refresh_token);
  res.send({ access_token });
});

module.exports = app => {
  app.use(cookieParser('asdufhiaisudhfasdf'));
  app.use('/auth', router);
};
