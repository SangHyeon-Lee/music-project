import classNames from "classnames";
import React, { memo, useEffect, useRef, useState } from "react";
import NoteTaking from "./note-taking";
import Controlbar from "./Controlbar";
import { Slider } from "antd";
import { Select } from "antd";
import { Radio, Space, Button } from "antd";
import LiveNote from "./live-note";
import "./Video.css";
import { useVideoElement } from "./VideoElementContext";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "./redux/modules";
import { setTime } from "./redux/modules/videoTime";
import { setDTime } from "./redux/modules/videoDuration";
import firebase from "firebase";
import clipicon from "./assets/icons/clip.png";
import energyicon from "./assets/icons/energy.png";
import suctionicon from "./assets/icons/suction.png";
import stitchicon from "./assets/icons/stitch.png";
import { borderColor } from "@material-ui/system";
import ActionIcon from "./actionIcon";

interface IProps {
  className?: string;
  src: string;
}

var actions: string[] = [];
var actionTime: number[] = [];

function useForceUpdate(): () => void {
  return React.useReducer(() => ({}), {})[1] as () => void // <- paste here
}

const Video: React.FC<IProps> = ({ className, src }) => {
  const [nowPlaying, setNowPlaying] = useState(false);
  const [showControl, setShowControl] = useState(false);
  const [totalTime, setTotalTime] = useState(0);
  const { videoElement, setVideoElement } = useVideoElement()!;
  const [editorIsFocused, seteditorIsFocused] = useState(false);
  const [onEdit, setonEdit] = useState(false);
  const [conaction, setconaction] = React.useState("Incise / Separate");
  const [startstop, setstartstop] = useState(false);
  const [actionlist, setactionlist] = useState(actions);
  const [updatenum, setupdatenum] = useState(0);
  const [actiontimelist, setactiontimelist] = useState(actionTime);
  

  const videoTime = useSelector(
    (state: RootState) => state.setVideoTime.videoTime
  );
  const dispatch = useDispatch();

  const setVideoTime = (time: number) => {
    dispatch(setTime(time));
  };

  const ref = useRef<HTMLVideoElement>(null);

  type CountdownHandle = React.ElementRef<typeof NoteTaking>;
  const noteTakingRef = useRef<CountdownHandle>(null);

  // const totalTime = (ref && ref.current && ref.current.duration) || 0; //총 길이
  setVideoElement(ref && ref.current);

  const videoSrc = src || "";
  const startTime = Math.floor(videoTime);
  const handleLoadedMDN = (e: any) => {
    setTotalTime(e.target.duration);
    console.log(e.target.duration);
    dispatch(setDTime(e.target.duration));
  };
  // 동영상 시간 업데이트 함수
  const addTimeUpdate = () => {
    const observedVideoElement = ref && ref.current;
    if (observedVideoElement) {
      observedVideoElement.addEventListener("timeupdate", function () {
        setVideoTime(Math.floor(observedVideoElement.currentTime));
      });

      // 컴포넌트가 처음 마운트 될때 동영상 시작 안함
      setNowPlaying(false);
      // observedVideoElement.play();
    }
  };
  const setPlaybackRate = (rate: number) => {
    if (videoElement) {
      videoElement.playbackRate = rate;
    }
  };
  useEffect(() => {
    addTimeUpdate();
  }, []);

  // progress 이동시켰을때 실행되는 함수
  const onProgressChange = (percent: number) => {
    if (!showControl) {
      setShowControl(true);
    }
    if (videoElement) {
      if (onEdit) {
        var confirm: boolean = window.confirm(
          "Do you want to discard the note and proceed?"
        );
        if (confirm) {
          const playingTime = videoElement.duration * (percent / 100);
          setVideoTime(playingTime);
          videoElement.currentTime = playingTime;
          noteTakingRef.current!.clearEditor();
        } else {
        }
      } else {
        const playingTime = videoElement.duration * (percent / 100);
        setVideoTime(playingTime);
        videoElement.currentTime = playingTime;
      }
    }
  };

  // play icon 클릭했을떄 실행되는 함수
  const onPlayIconClick = () => {
    if (videoElement) {
      if (nowPlaying) {
        setNowPlaying(false);
        videoElement.pause();
      } else {
        if (onEdit) {
          var confirm: boolean = window.confirm(
            "Do you want to discard the note and proceed?"
          );
          if (confirm) {
            setNowPlaying(true);
            videoElement.play();
            noteTakingRef.current!.clearEditor();
          } else {
          }
        } else {
          setNowPlaying(true);
          videoElement.play();
        }
      }
    }
  };

  // control bar visible 관련 함수
  // 재생중일때만 나가면 control바 안보이고 들어오면 컨드롤바 보이게
  const setControlVisible = () => {
    if (!showControl) {
      setShowControl(true);
    }
  };

  const setControlInvisible = () => {
    if (showControl && nowPlaying) {
      setShowControl(false);
    }
  };

  window.onkeydown = (event: KeyboardEvent): any => {
    if (event.key === " ") {
      if (!editorIsFocused) {
        if (nowPlaying) {
          setNowPlaying(false);
          videoElement.pause();
        } else {
          if (onEdit) {
            var confirm: boolean = window.confirm(
              "Do you want to discard the note and proceed?"
            );
            if (confirm) {
              setNowPlaying(true);
              videoElement.play();
              noteTakingRef.current!.clearEditor();
            } else {
            }
          } else {
            setNowPlaying(true);
            videoElement.play();
          }
        }
      }
    }
  };

  const onconactionChange = (e: any) => {
    setconaction(e.target.value);
  };

  const update = () => {
    setupdatenum(updatenum + 1);
  }

  return (
    <div>
      <div
        className="video-player-container"
        onMouseEnter={setControlVisible}
        onMouseLeave={setControlInvisible}
      >
        <video
          className="video-container"
          loop={false}
          muted={true}
          ref={ref}
          playsInline={true}
          onClick={onPlayIconClick}
          onLoadedMetadata={handleLoadedMDN}
          crossOrigin="Anonymous"
          style={{
            cursor: "pointer",
          }}
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
        <Controlbar
          onProgressChange={onProgressChange}
          onPlayIconClick={onPlayIconClick}
          totalTime={totalTime}
          startTime={startTime}
          showControl={showControl}
          nowPlaying={nowPlaying}
          videoElement={videoElement}
        />
      </div>

      {/* <div className="note-and-slider-container">
        <div className="slider-container">
          Video Speed
          <Slider
            id="playbackslider"
            marks={marks}
            step={null}
            defaultValue={1}
            max={4}
            onChange={(value: any) => setPlaybackRate(value)}
          />
        </div>
        <NoteTaking
          ref={noteTakingRef}
          userId={firebase.auth().currentUser? firebase.auth().currentUser?.email!.split("@")[0]!:"TestUser"}
          nowPlaying={setNowPlaying}
          setIsFocused={seteditorIsFocused}
          setonEdit={setonEdit}
        />
      </div> */}
      <div>
        <div className="steps">
          <br />
          <div className="step-one">
            1. Start continuous actions
            <div className="step-one-option">
              <Radio.Group onChange={onconactionChange} value={conaction}>
                <Radio value={"Incise / Separate"}>Incise / Separate</Radio>
                <Radio value={"Suture"}>Suture</Radio>
              </Radio.Group>
              <br />
              <br />
              <Button
                onClick={(e: any) => {
                  setstartstop(true);
                  actions = [];
                  actionTime = [];
                  actions.push("start");
                  setactionlist(actions);
                  actionTime.push(videoTime);
                  setactiontimelist(actionTime);
                  update();
                }}
              >
                Start
              </Button>
              <Button
                onClick={(e: any) => {
                  setstartstop(false);
                  actions.push("stop");
                  setactionlist(actions);
                  actionTime.push(videoTime);
                  setactiontimelist(actionTime);
                  update();
                }}
              >
                Stop
              </Button>
            </div>
          </div>
          <div className="step-two">
            2. Select instant actions in between
            <br />
            <div className="step-two-option">
              <button
                style={{
                  cursor: "pointer",
                  backgroundColor: "white",
                  borderColor: "transparent",
                }}
                onClick={(e: any) => {
                  if (startstop) {
                    actions.push("clip");
                    setactionlist(actions);
                    actionTime.push(videoTime);
                    setactiontimelist(actionTime);
                    update();
                  }
                }}
              >
                <Space align="center">
                  <img src={clipicon} width="32px" />
                </Space>
              </button>
              <button
                style={{
                  cursor: "pointer",
                  backgroundColor: "white",
                  borderColor: "transparent",
                }}
                onClick={(e: any) => {
                  if (startstop) {
                    actions.push("energy");
                    setactionlist(actions);
                    actionTime.push(videoTime);
                    setactiontimelist(actionTime);
                    update();
                  }
                }}
              >
                <Space align="center">
                  <img src={energyicon} width="32px" />
                </Space>
              </button>
              <button
                style={{
                  cursor: "pointer",
                  backgroundColor: "white",
                  borderColor: "transparent",
                }}
                onClick={(e: any) => {
                  if (startstop) {
                    actions.push("suction");
                    setactionlist(actions);
                    actionTime.push(videoTime);
                    setactiontimelist(actionTime);
                    update();
                  }
                }}
              >
                <Space align="center">
                  <img src={suctionicon} width="32px" />
                </Space>
              </button>
              <button
                style={{
                  cursor: "pointer",
                  backgroundColor: "white",
                  borderColor: "transparent",
                }}
                onClick={(e: any) => {
                  if (startstop) {
                    actions.push("stitch");
                    setactionlist(actions);
                    actionTime.push(videoTime);
                    setactiontimelist(actionTime);
                    update();
                  }
                }}
              >
                <Space align="center">
                  <img src={stitchicon} width="32px" />
                </Space>
              </button>
            </div>
            <div>
            <Button
                onClick={(e: any) => {
                  if(startstop){
                    actions.pop();
                    setactionlist(actions);
                    actionTime.pop();
                    setactiontimelist(actionTime);
                    update();
                  }
  
                }}
              >
                Undo
              </Button>
            </div>
          </div>
          <div className="step-three">
            3. Stop and map the actions to the anatomy model on the right
            <div>
              {actionTime.map((actiontime: any) => (
                <div style={{ display: "inline-block" }}>{actiontime} &nbsp;</div>
              ))}
              <ActionIcon actionlist={actionlist} actionTime = {actiontimelist} />
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(Video);
