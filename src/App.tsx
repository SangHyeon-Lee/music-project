import React, { useState }  from 'react';
import ReactPlayer from 'react-player';
import './App.css';
import NoteTaking from './note-taking';

function App() {
  const [isPaused, setPaused] = useState<Boolean>(false);
  //const setPausedTrue = () => setPaused(true)
  const setPausedFalse = () => setPaused(false)

  function noteTaking(): any {
    setPaused(true)
    console.log("Note Taking is called");
  }

  return (
    <div>
      <ReactPlayer
        className='player'
        url='videos/sample.mp4'
        width='80%'
        height='80%'
        controls={true}
        onPause={noteTaking}
        onPlay={setPausedFalse}
      />
      {isPaused && <NoteTaking name='Test' timestamp='0000'
      />}
    </div>
  );
}


export default App;
