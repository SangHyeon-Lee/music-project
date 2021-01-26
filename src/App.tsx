import React, { useState } from "react";
import ReactPlayer from "react-player";
import "./App.css";
import NoteTaking from "./note-taking";
import NoteCollection from "./note-collection";
import { Slider } from 'antd';

const marks = {
  0.5: 'x0.5',
  1: 'x1',
  1.5: 'x1.5',
  2: 'x2',
  4:'x4'
};

interface AppProps {
  history?: any;
}

const App: React.FC<AppProps> = props => {

  const [duration,setDuration] = useState<number>(0);
  const [secondsElapsed,setSecondsElapsed] = useState<number>(0);
  const [isPaused,setIsPaused] = useState<boolean>(false);
  const [playbackRate,setPlaybackRate] = useState<number>(1);


  const onDuration = (duration: any) => {
    setDuration(duration)
  };
  const onProgress = (progress: any) => {
    if (!duration) {
      // Sadly we don't have the duration yet so we can't do anything
      return;
    }

    // progress.played is the fraction of the video that has been played
    // so multiply with duration to get number of seconds elapsed
    const tempsecondsElapsed = Math.floor(progress.played * duration);
    if (tempsecondsElapsed !== secondsElapsed) {
      setSecondsElapsed(tempsecondsElapsed)
    }
  };

  const noteTaking = () => {
    const isPaused = true;
    setIsPaused(isPaused)
    console.log("Note Taking is called");
  };

  const setPausedFalse = () => {
    const isPaused = false;
    setIsPaused(isPaused)
  };


  return (
    <div>
      <Slider marks={marks} step={null} defaultValue={1} max={4} onChange={(value:any) => setPlaybackRate(value)}/>
      <ReactPlayer
        className="player"
        url="videos/Full_Surgeon.mp4"
        width="80%"
        height="80%"
        controls={true}
        onPause={noteTaking}
        onPlay={setPausedFalse}
        onDuration={onDuration}
        onProgress={onProgress}
        playbackRate={playbackRate}
      />
      <NoteCollection />
      <div>
        {isPaused && (
          <NoteTaking
            userId="TestUser"
            timestamp={secondsElapsed}
          />
        )}
      </div>
    </div>
  );
}

export default App;
