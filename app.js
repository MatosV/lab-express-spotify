const dotnev = require('dotenv');
dotnev.config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const path = require('path');
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname + '/views'));
app.use(express.static(path.join(__dirname + '/public')));

// setting the spotify-api goes here:
// Retrieve an access token

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body['access_token']))
  .catch((error) => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:

app.get('/', (req, res) => {
  res.render('artist-search');
});

app.get('/artist-search', (req, res) => {
  const artist = req.query.artist;
  //console.log(artist);
  spotifyApi
    .searchArtists(artist)
    .then((data) => {
      //console.log('The received data from the API: ', data.body.artists);
      //console.log(artists = data.body.artists.items)
      artists = data.body.artists.items
      res.render('artist-search-results', {artists})
    })
    .catch((err) => console.log('The error while searching artists occurred: ', err));
});

app.get('/albums/:artistId', (req, res, next) => {
  const album = req.params.id;
  spotifyApi
  // .getArtistAlbums() code goes here
  .getArtistAlbums(album)
  .then((data)=>{
    //console.log(albums = data.body.items);
    const albums = data.body.itms;
    res.render('album', {albums})
  })
  .catch((err) => console.log(err))
});

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
