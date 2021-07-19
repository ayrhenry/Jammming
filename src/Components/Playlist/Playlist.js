import React from 'react'
import './Playlist.css'
import Tracklist from '../Tracklist/Tracklist'

class Playlist extends React.Component {
    constructor(props){
        super(props);
        this.handleNameChange = this.handleNameChange.bind(this);
    }
    handleNameChange(e){
        this.props.onNameChange(e.target.value)
    }
    render(){
        return(
            <div className="Playlist">
                <input onChange={this.handleNameChange} defaultValue={'New Playlist'}/>
                <Tracklist tracks={this.props.playlistTracks} onRemove={this.props.onRemove} isRemoval={true} />
                <button className="Playlist-save" onClick={this.props.onSave}>SAVE TO SPOTIFY</button>
            </div>
        )
    }
}

export default Playlist;