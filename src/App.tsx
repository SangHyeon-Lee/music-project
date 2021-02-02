import React, { useState } from "react";
import ReactPlayer from "react-player";
import "./App.css";
import NoteTaking from "./note-taking";
import NoteCollection from "./note-collection";
import { Slider, Button } from "antd";
import { PictureOutlined } from "@ant-design/icons";
import captureVideoFrame from "capture-video-frame";
import { Link } from "react-router-dom";
import CanvasDraw from "react-canvas-draw";

const marks = {
  0.5: "x0.5",
  1: "x1",
  1.5: "x1.5",
  2: "x2",
  4: "x4"
};

interface AppProps {
  history?: any;
}

const App: React.FC<AppProps> = (props) => {
  const [duration, setDuration] = useState<number>(0);
  const [secondsElapsed, setSecondsElapsed] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [image, setImage] = useState<any>(null);
  const [player, setPlayer] = useState<any>(null);
  const [isDraw, setDraw] = useState<boolean>(false);
  const [canvas, setCanvas] = useState<any>(null);
  const [savedImage, setsavedImage] = useState<any>(null);

  const onDuration = (duration: any) => {
    setDuration(duration);
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
      setSecondsElapsed(tempsecondsElapsed);
    }
  };

  return (
    <div>
      <div className="appbody">
        <div>
          <Slider
            marks={marks}
            step={null}
            defaultValue={1}
            max={4}
            onChange={(value: any) => setPlaybackRate(value)}
          />
          <ReactPlayer
            ref={(player) => {
              setPlayer(player);
            }}
            className="player"
            url="videos/Full_Surgeon.mp4"
            width="93%"
            height="93"
            controls={true}
            onPause={() => {
              setIsPaused(true);
            }}
            onPlay={() => {
              setIsPaused(false);
              setImage(null);
              setDraw(false);
              setsavedImage(null);
            }}
            onDuration={onDuration}
            onProgress={onProgress}
            playbackRate={playbackRate}
          />
        </div>
        <NoteCollection />
        <div>
          {isPaused && (
            <NoteTaking userId="TestUser" timestamp={secondsElapsed} />
          )}
        </div>
      </div>

      <div>
        {isPaused && (
          <div>
            <Button
              type="primary"
              shape="round"
              icon={<PictureOutlined />}
              onClick={() => {
                var frame = captureVideoFrame(
                  player.getInternalPlayer(),
                  "png"
                );
                console.log("captured frame", frame);
                setImage(frame.dataUri);
              }}
            >
              Capture Frame
            </Button>

            <Button type="link" onClick={() => setDraw(!isDraw)}>
              Draw
            </Button>

            <br />
            <br />
            {image && (
              <img id="capturedImage" src={image} width="320px" alt="" />
            )}
            {isDraw && (
              <div>
                <Button
                  onClick={() => {
                    let baseCanvas = canvas.canvasContainer.children[3];
                    let baseCanvasContex = baseCanvas.getContext("2d");
                    baseCanvasContex.drawImage(
                      canvas.canvasContainer.children[1],
                      0,
                      0
                    ); // add drawing
                    setsavedImage(baseCanvas.toDataURL());
                  }}
                >
                  Save
                </Button>
                <Button
                  onClick={() => {
                    canvas.clear();
                  }}
                >
                  Clear
                </Button>
                <Button
                  onClick={() => {
                    canvas.undo();
                  }}
                >
                  Undo
                </Button>
                <div id="canvasdraw" className="canvasdraw">
                  <CanvasDraw
                    ref={(canvas: any) => {
                      setCanvas(canvas);
                    }}
                    imgSrc={image}
                    canvasWidth="320px"
                    canvasHeight="180px"
                    hideInterface
                    brushColor="#000000"
                    brushRadius="1"
                  />
                </div>
                {savedImage && <img src={savedImage} alt="" />}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
