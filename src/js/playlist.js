function getAccessToken() {
  const hash = window.location.hash; //get the hash after .html#
  const hashWithoutHash = hash.substring(1); //removes the #
  const params = hashWithoutHash.split('&'); //spit the sring at '&'
  const keyValues = params.map((param) => param.split('='))  // .split() don't keep the character you split on
  const accessToken = keyValues[0][1];
  return accessToken;
}
getAccessToken();

/* curl requetst as JS.
curl -X "GET" "https://api.spotify.com/v1/playlists/3cEYpjA9oz9GiPac4AsH4n?market=SE" 
     -H "Accept: application/json" 
     -H "Content-Type: application/json" 
     -H "Authorization: Bearer BQAUTHY-5GpdC3q8oV3dQsVEZPRbzScKcX0Eobx_oFRps2BJuvKI9cPhuIQcTgkyS93SGeSFibgvdiqCLpYoiN4snYW1pbt4Q6Obbmpp1tf6TVhU3zsw625k1qZ-lr5UqOUZjrF-"*/

function getPlaylist(playlist_id) {
  const url = `https://api.spotify.com/v1/playlists/${playlist_id}`;
  const headers = {
    Accept        : 'application/json',
    'Content-Type': 'application/json',
    Authorization : `Bearer ${getAccessToken()}`
  };
  // fetch the url w/ headers object then return the respons as json
  return fetch(url, { headers }).then((response) => response.json());
}

function renderPlaylist(playlist_id) {
/*  <div class="playlist-item">
      <img class="playlist-item-img" src="IMG_URL" />
      <div class="playlist-item-title">SONG_TITLE</div>
    </div> */
  const container = document.getElementById('tracks');
  const audioPlayer = document.getElementById('player');
  getPlaylist(playlist_id).then((playlist) => {
    const tracks = playlist.tracks.items;
    for (let i = 0; i < tracks.length; i++) {
      const track = tracks[i].track;

      const playlistItem = document.createElement('div');
      playlistItem.classList.add('playlist-item');

      const playlistItemImg = document.createElement('img')
      playlistItemImg.classList.add('playlist-item-img');
      playlistItemImg.setAttribute('src', track.album.images[0].url);
      
      const playlistItemTitle = document.createElement('div');
      playlistItemTitle.classList.add('playlist-item-title')
      playlistItemTitle.innerHTML = track.name;

      playlistItem.addEventListener('click', () => {
        if (currentlyActive === track.id) {
          audioPlayer.pause();
          currentlyActive = null;
          playlistItem.classList.remove('active');
        } else {
          if (currentlyActive) {
            document.querySelector('.active').classList.remove('active')
          }
          currentlyActive = track.id;
          playlistItem.classList.add('active');
          if (track.preview_url) {
            audioPlayer.setAttribute('src', track.preview_url)
            audioPlayer.play();
          } else {
            audioPlayer.pause();
          }
        }
       
      })

      playlistItem.appendChild(playlistItemImg);
      playlistItem.appendChild(playlistItemTitle);
      container.appendChild(playlistItem);
    }
  }
    
  ); 
};
let currentlyActive;
renderPlaylist('37i9dQZF1DX4UtSsGT1Sbe');//a