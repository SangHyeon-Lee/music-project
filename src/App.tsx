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
import { CompactPicker } from "react-color";

const marks = {
  0.5: "x0.5",
  1: "x1",
  1.5: "x1.5",
  2: "x2",
  4: "x4",
  10: "x10",
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
  const [showColorPicker, setColorPicker] = useState<boolean>(false);
  const [editorColor, seteditorColor] = useState<any>("#000000");

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

  const popover = {
    position: "absolute",
    zIndex: "2",
  };
  const cover = {
    position: "fixed",
    top: "0px",
    right: "0px",
    bottom: "0px",
    left: "0px",
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
            url="videos/sample.mp4"
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
    
            }}
            onDuration={onDuration}
            onProgress={onProgress}
            playbackRate={playbackRate}
          />
        </div>
        <NoteCollection />
        <div>
          {isPaused && (
            <NoteTaking userId="TestUser" timestamp={secondsElapsed} screenshot={image}/>
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
                  "png",
                  1
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
            {image && !isDraw && <img id="capturedImage" src={image} alt="" />}
            {isDraw && !savedImage && (
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
                    setDraw(false);
                    setImage(baseCanvas.toDataURL());
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
                <Button
                  onClick={() => {
                    setColorPicker(!showColorPicker);
                  }}
                >
                  Pick Color
                </Button>
                {showColorPicker ? (
                  <div>
                    <div
                      onClick={() => {
                        setColorPicker(false);
                      }}
                    />
                    <CompactPicker
                      color={editorColor}
                      onChange={(color) => {
                        seteditorColor(color.hex);
                      }}
                    />
                  </div>
                ) : null}
                <div id="canvasdraw" className="canvasdraw">
                  <CanvasDraw
                    ref={(canvas: any) => {
                      setCanvas(canvas);
                    }}
                    imgSrc={image}
                    canvasWidth="640px"
                    canvasHeight="360px"
                    lazyRadius="0"
                    brushColor={editorColor}
                    brushRadius="1"
                  />
                </div>
              </div>
            )}
            
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
