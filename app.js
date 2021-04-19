require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  // accessToken: "BQCReIT8GHly3nZAlPvZNqm3_YDOlQzjaaSpuzD4YaAw33hWMg-B8VupOonN1S8W7PrZABk5HIuC_3Z3cV4"
});

// Retrieve an access token.

spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));

// spotifyApi.clientCredentialsGrant().then(
//   function (data) {
//     console.log('The access token is ' + data.body['access_token']);
//     spotifyApi.setAccessToken(data.body['access_token']);
//   },
//   function (err) {
//     console.log('Something went wrong!', err);
//   },
// );

// Our routes go here:

app.get('/', (req, res, next) => {
  res.render('home');
});

app.get('/artist-search', (req, res, next) => {
  spotifyApi
    .searchArtists(req.query.name)
    .then(data => {
      console.log('The received data from the API: ', data.body);
      const artist = {
      artist: data.body.artists.items,
      //SpotifyApi.ArtistObjectFull[]
      };
      res.render('artist-search-results', artist);
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
});

app.get('/albums', (req, res, next) => {
  res.render('albums');
});


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));

