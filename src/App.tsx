import React, { useState } from "react";
import ReactPlayer from "react-player";
import "./App.css";
import NoteTaking from "./note-taking";
import NoteCollection from "./note-collection";

class App extends React.Component {
  state = {
    duration: 0,
    secondsElapsed: 0,
    isPaused: false,
  };

  onDuration = (duration: any) => {
    this.setState({ duration });
  };
  onProgress = (progress: any) => {
    if (!this.state.duration) {
      // Sadly we don't have the duration yet so we can't do anything
      return;
    }

    // progress.played is the fraction of the video that has been played
    // so multiply with duration to get number of seconds elapsed
    const secondsElapsed = Math.floor(progress.played * this.state.duration);
    console.log(secondsElapsed);
    if (secondsElapsed !== this.state.secondsElapsed) {
      this.setState({ secondsElapsed });
    }
  };

  noteTaking = () => {
    const isPaused = true;
    this.setState({ isPaused });
    console.log("Note Taking is called");
  };

  setPausedFalse = () => {
    const isPaused = false;
    this.setState({ isPaused });
  };

  render() {
    return (
      <div>
        <ReactPlayer
          className="player"
          url="videos/sample.mp4"
          width="80%"
          height="80%"
          controls={true}
          onPause={this.noteTaking}
          onPlay={this.setPausedFalse}
          onDuration={this.onDuration}
          onProgress={this.onProgress}
        />
        <NoteCollection />
        <div>
          {this.state.isPaused && (
            <NoteTaking
              userId="TestUser"
              timestamp={this.state.secondsElapsed}
            />
          )}
        </div>
      </div>
    );
  }
}

export default App;
