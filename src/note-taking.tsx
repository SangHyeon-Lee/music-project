import React, { useState, useImperativeHandle } from "react";
import { Editor, EditorState, ContentState } from "draft-js";
import "draft-js/dist/Draft.css";
import "./note-taking.css";
import { Slider, Button, Radio, Popover, message } from "antd";
import firebase from "./firebase";
import { v4 as uuid } from "uuid";
import CanvasDraw from "react-canvas-draw";
import { CompactPicker } from "react-color";
import { PictureOutlined } from "@ant-design/icons";
import {
  ColorLens,
  LineWeight,
  Undo,
  Delete,
  Save,
  Clear,
} from "@material-ui/icons";
import captureVideoFrame from "capture-video-frame";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "./redux/modules";
import { useVideoElement } from "./VideoElementContext";
import { setTime } from "./redux/modules/videoTime";
import { setCollectionFromDB } from "./redux/modules/noteCollection";

var db = firebase.firestore();
var storage = firebase.storage();
interface noteTakingProps {
  userId: string;
  nowPlaying: any;
  setIsFocused: any;
  setonEdit: any;
}

type CountdownHandle = {
  clearEditor: () => void;
};

const NoteTaking = React.forwardRef(
  (props: noteTakingProps, ref: React.Ref<CountdownHandle>) => {
    const [editorState, seteditorState] = useState<EditorState>(
      EditorState.createEmpty()
    );
    const [image, setImage] = useState<any>(null);
    const [canvas, setCanvas] = useState<any>(null);
    const [showCanvas, setshowCanvas] = useState<boolean>(false);
    const [showColorPicker, setColorPicker] = useState<boolean>(false);
    const [editorColor, seteditorColor] = useState<any>("#000000");
    const [showRadius, setshowRadius] = useState<boolean>(false);
    const [brushRadius, setbrushRadius] = useState<number>(3);
    const [noteCategory, setnoteCategory] = useState<string>("Awesome");
    const [placeholder, setplaceholder] = useState<string>(
      "This is such a useful tip because..."
    );

    const videoTime = useSelector(
      (state: RootState) => state.setVideoTime.videoTime
    );
    const videoDTime = useSelector(
      (state: RootState) => state.setVideoDTime.videoDuration
    );
    const { videoElement, setVideoElement } = useVideoElement()!;
    const dispatch = useDispatch();

    const setVideoTime = (time: number) => {
      dispatch(setTime(time));
    };

    const handleChange = (e: EditorState) => {
      seteditorState(e);
      if (e.getCurrentContent().hasText()) {
        props.setonEdit(true);
      } else {
        if (!showCanvas) {
          props.setonEdit(false);
        } else {
          props.setonEdit(true);
        }
      }
    };
    const submitNote = () => {
      const noteCollection = db
        .collection("videos")
        .doc("testvideo1")
        .collection("note");
      //console.log(this.props.screenshot);

      const id: string = uuid();
      const ref: string = "screenshots/" + id + ".png";

      if (image != null) {
        storage
          .ref(ref)
          .putString(image, "data_url")
          .then((snapshot) =>
            snapshot.ref.getDownloadURL().then((downloadURL) => {
              console.log("download:    ", downloadURL);
              noteCollection.add({
                category: noteCategory,
                content: editorState.getCurrentContent().getPlainText("\u0001"),
                //timestamp: "",
                userId: props.userId,
                videoTimestamp: videoTime,
                downloadURL: downloadURL,
              });
            })
          );
      } else {
        noteCollection.add({
          category: noteCategory,
          content: editorState.getCurrentContent().getPlainText("\u0001"),
          //timestamp: "",
          userId: props.userId,
          videoTimestamp: videoTime,
          downloadURL: "",
        });
      }
      seteditorState(
        EditorState.push(
          editorState,
          ContentState.createFromText(""),
          "remove-range"
        )
      );
      dispatch(setCollectionFromDB("testvideo1", videoDTime));

      setshowCanvas(false);
      message.success("Note is saved!");
    };

    const changeplaceholder = (category: string) => {
      if (category === "Awesome") {
        setplaceholder("This is such a useful tip because...");
      } else if (category === "Difficult") {
        setplaceholder("Watch out doing this part because...");
      } else if (category === "What If") {
        setplaceholder("Instead of ..., How about ...?");
      } else if (category === "What & Why") {
        setplaceholder("Why in this part ...?");
      } else {
        setplaceholder("");
      }
    };

    const onChange = (e: any) => {
      // console.log(`radio checked:${e.target.value}`);
      setnoteCategory(e.target.value);
      changeplaceholder(e.target.value);
    };

    useImperativeHandle(ref, () => ({
      clearEditor() {
        seteditorState(
          EditorState.push(
            editorState,
            ContentState.createFromText(""),
            "remove-range"
          )
        );
        setshowCanvas(false);
        props.setonEdit(false);
      },
    }));

    // const clearEditor = () => {
    //   seteditorState(
    //     EditorState.push(
    //       editorState,
    //       ContentState.createFromText(""),
    //       "remove-range"
    //     )
    //   );
    //   setshowCanvas(false);
    // };

    return (
      <div>
        <div>
          <Radio.Group
            className="category-group"
            onChange={onChange}
            defaultValue="Awesome"
          >
            <Radio.Button className="category-entry" value="Awesome">
              Awesome
            </Radio.Button>
            <Radio.Button className="category-entry" value="What If">
              What If
            </Radio.Button>
            <Radio.Button className="category-entry" value="What & Why">
              What & Why
            </Radio.Button>
            <Radio.Button className="category-entry" value="Difficult">
              Difficult
            </Radio.Button>
          </Radio.Group>
          <Button
            type="primary"
            shape="round"
            icon={<PictureOutlined />}
            onClick={() => {
              props.setonEdit(true);
              videoElement.pause();
              props.nowPlaying(false);
              var frame = captureVideoFrame(videoElement, "png", 1);
              setImage(frame.dataUri);
              setshowCanvas(true);
            }}
          >
            Take a Screenshot and Draw
          </Button>
          <div className="draft-root">
            <Editor
              editorState={editorState}
              placeholder={placeholder}
              onChange={(e) => handleChange(e)}
              onFocus={() => {
                videoElement.pause();
                props.nowPlaying(false);
                props.setIsFocused(true);
              }}
              onBlur={() => {
                props.setIsFocused(false);
              }}
            />
            <Button type="primary" onClick={submitNote}>
              Submit
            </Button>
          </div>
        </div>

        <div className="note-taking-container">
          {showCanvas && (
            <div className="screenshot-editor-container">
              <div className="screenshot-picture-container">
                <CanvasDraw
                  ref={(canvas: any) => {
                    setCanvas(canvas);
                  }}
                  imgSrc={image}
                  canvasWidth="30vw"
                  canvasHeight="24vw"
                  lazyRadius="0"
                  brushColor={editorColor}
                  brushRadius={brushRadius}
                />
              </div>

              <div>
                <Popover placement="bottom" content="Brush Color">
                  <Button
                    onClick={() => {
                      setColorPicker(!showColorPicker);
                      setshowRadius(false);
                    }}
                  >
                    <ColorLens />
                  </Button>
                </Popover>
                <Popover placement="bottom" content="Brush Radius">
                  <Button
                    onClick={() => {
                      setColorPicker(false);
                      setshowRadius(!showRadius);
                    }}
                  >
                    <LineWeight />
                  </Button>
                </Popover>
                <Popover placement="bottom" content="Undo">
                  <Button
                    onClick={() => {
                      canvas.undo();
                    }}
                  >
                    <Undo />
                  </Button>
                </Popover>
                <Popover placement="bottom" content="Clear">
                  <Button
                    onClick={() => {
                      canvas.clear();
                    }}
                  >
                    <Delete />
                  </Button>
                </Popover>
                <Popover placement="bottom" content="Save">
                  <Button
                    onClick={() => {
                      let baseCanvas = canvas.canvasContainer.children[3];
                      let baseCanvasContex = baseCanvas.getContext("2d");
                      baseCanvasContex.drawImage(
                        canvas.canvasContainer.children[1],
                        0,
                        0
                      ); // add drawing
                      setImage(baseCanvas.toDataURL());
                    }}
                  >
                    <Save />
                  </Button>
                </Popover>
                <Popover placement="bottom" content="Discard">
                  <Button
                    onClick={() => {
                      var confirm: boolean = window.confirm(
                        "Do you want to discard the screenshot?"
                      );
                      if (confirm) {
                        if (!editorState.getCurrentContent().hasText()) {
                          props.setonEdit(false);
                        }
                        setImage(null);
                        setshowCanvas(false);
                      } else {
                      }
                    }}
                  >
                    <Clear />
                  </Button>
                </Popover>
              </div>

              <div>
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
                  <div className="lineweight-container">
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
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
);

export default NoteTaking;
