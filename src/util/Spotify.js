
let accessToken;
const clientID = 'ef0147ebc2d64d42ac060d3317645a0f';
const redirectURL = "https://jammmingayran.surge.sh"


let Spotify = { 
    getAccessToken(){
        if(accessToken){
            return accessToken;
        }

         const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/)
         const expirationTimeMatch = window.location.href.match(/expires_in=([^&]*)/)
         if (accessTokenMatch && expirationTimeMatch){
             accessToken = accessTokenMatch[1];
             const expiresIn = Number(expirationTimeMatch[1])
             //This clears the parameters, allowing us to grab a new access token when it expires.
             window.setTimeout(() => accessToken = '', expiresIn * 1000);
             window.history.pushState('Access Token', null, '/');
             return accessToken;
         }else {
            window.location = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURL}`
         }
         
         
         
    },
    savePlaylist(playlistName, trackURIs){
        if(!playlistName || !trackURIs){
            return;
            
        }
        let accessToken = Spotify.getAccessToken()
        const headers = {
            Authorization: `Bearer ${accessToken}`
        }
        let userId;
        return fetch(`https://api.spotify.com/v1/me`, {headers: headers}
            ).then(response => response.json()
            ).then(jsonResponse => {
                userId = jsonResponse.id;
                return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
                    headers: headers,
                    method: 'POST',
                    body: JSON.stringify({name: playlistName})
                }).then(response => response.json()
                ).then(jsonResponse => {
                    const playlistId = jsonResponse.id;
                    return fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`, {
                        headers: headers,
                        method: 'POST',
                        body: JSON.stringify({uris: trackURIs})
                    })
                })
            })
    },
    search(searchTerm){
        const accessToken = Spotify.getAccessToken();
        return fetch(`https://api.spotify.com/v1/search?type=track&q=${searchTerm}`, {
            headers: {Authorization: `Bearer ${accessToken}`}
        }).then(response => {
            return response.json()
        }).then(jsonResponse => {
            if (!jsonResponse.tracks){
                return [];
            }
            return jsonResponse.tracks.items.map(track => ({
                id: track.id,
                name: track.name,
                artist: track.artists[0].name,
                album: track.album.name,
                uri: track.uri
            }));
        })
    }
    

}

export default Spotify;