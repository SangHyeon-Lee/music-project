import React, { useState } from "react";
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import ReactPlayer from "react-player";
import "./App.css";
import NoteTaking from "./note-taking";
import NoteCollection from "./note-collection";
import { Slider, Button } from "antd";
import { PictureOutlined } from "@ant-design/icons";
import captureVideoFrame from "capture-video-frame";
import { Link } from "react-router-dom";
import CanvasDraw from "react-canvas-draw";
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import { Menu, ChevronRight } from '@material-ui/icons';
import { CompactPicker } from "react-color";
// import { Slider } from 'antd';
import Video from "./Video";

const marks = {
  0.5: "x0.5",
  1: "x1",
  1.5: "x1.5",
  2: "x2",
  4: "x4"
};
const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: drawerWidth,
  },
  title: {
    flexGrow: 1,
  },
  open: {
    position: "absolute",
    right: '0px',
    margin: 'auto',
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-start',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginRight: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: 0,
  },
}));


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
  //const [savedImage, setsavedImage] = useState<any>(null);
  const [showColorPicker, setColorPicker] = useState<boolean>(false);
  const [editorColor, seteditorColor] = useState<any>("#000000");
  const [showRadius, setshowRadius] = useState<boolean>(false);
  const [brushRadius, setbrushRadius] = useState<number>(3);
  const [savedImage, setsavedImage] = useState<any>(null);
  const [open, setOpen] = React.useState(false);
  const classes = useStyles();

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
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
        <div
          className={clsx(classes.content, {
            [classes.contentShift]: open,
          })}
        >
          {/* <Slider
            marks={marks}
            step={null}
            defaultValue={1}
            max={4}
            onChange={(value: any) => setPlaybackRate(value)}
          /> */}
          {/* <ReactPlayer
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
            }}
            onDuration={onDuration}
            onProgress={onProgress}
            playbackRate={playbackRate}
          /> */}
          <Video src = "videos/Full_Surgeon.mp4" />
          <div className='notetaking-container'>
            {isPaused && (
              <NoteTaking userId="TestUser" timestamp={secondsElapsed} screenshot={image}/>
            )}
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
                    setshowRadius(false);
                  }}
                >
                  Pick Color
                </Button>

                <Button
                  onClick={() => {
                    setColorPicker(false);
                    setshowRadius(!showRadius);
                  }}
                >
                  Brush Radius
                </Button>
                {showColorPicker ? (
                  <div>
                    <CompactPicker
                      color={editorColor}
                      onChange={(color) => {
                        seteditorColor(color.hex);
                      }}
                    />
                  </div>
                ) : null}
                {showRadius ? (
                  <div>
                    <Slider
                      min={1}
                      max={10}
                      onChange={(value: React.SetStateAction<number>) => {
                        setbrushRadius(value);
                      }}
                      value={typeof brushRadius === "number" ? brushRadius : 3}
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
                    brushRadius={brushRadius}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
        </div>
        <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="end"
            onClick={handleDrawerOpen}
            className={clsx(!open && classes.open ,open && classes.hide)}
          >
            <Menu />
          </IconButton>
        <Drawer
          className={classes.drawer}
          variant="persistent"
          anchor="right"
          open={open}
          classes={{
            paper: classes.drawerPaper,
          }}
        >
          <div>
            <IconButton onClick={handleDrawerClose}>
              <ChevronRight />
            </IconButton>
          </div>
          <NoteCollection />
        </Drawer>
      </div>
    </div>
  );
};

export default App;
