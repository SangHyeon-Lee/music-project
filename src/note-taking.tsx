import React, { useState } from "react";
import { Editor, EditorState } from "draft-js";
import "draft-js/dist/Draft.css";
import "./note-taking.css";
import { Slider, Button, Radio } from "antd";
import firebase from "./firebase";
import { v4 as uuid } from "uuid";
import CanvasDraw from "react-canvas-draw";
import { CompactPicker } from "react-color";
import { PictureOutlined } from "@ant-design/icons";
import captureVideoFrame from "capture-video-frame";

var db = firebase.firestore();
var storage = firebase.storage();
interface noteTakingProps {
  userId: string;
  timestamp: number;
  player: any;
}

const NoteTaking: React.FC<noteTakingProps> = (props) => {
  const [editorState, seteditorState] = useState<any>(
    EditorState.createEmpty()
  );
  const [image, setImage] = useState<any>(null);
  const [isDraw, setDraw] = useState<boolean>(false);
  const [canvas, setCanvas] = useState<any>(null);
  const [showColorPicker, setColorPicker] = useState<boolean>(false);
  const [editorColor, seteditorColor] = useState<any>("#000000");
  const [showRadius, setshowRadius] = useState<boolean>(false);
  const [brushRadius, setbrushRadius] = useState<number>(3);
  const [noteCategory, setnoteCategory] = useState<string>("Awesome");
  const [placeholder, setplaceholder] = useState<string>(
    "This is such a useful tip because..."
  );

  const handleChange = (e: EditorState) => {
    seteditorState(e);
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
              videoTimestamp: props.timestamp,
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
        videoTimestamp: props.timestamp,
        downloadURL: "",
      });
      console.log(editorState.getCurrentContent().getPlainText("\u0001"));
    }
    window.alert("saved!");
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

  return (
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
      <div className="draft-root">
        <Editor
          editorState={editorState}
          placeholder={placeholder}
          onChange={(e) => handleChange(e)}
        />
        <Button type="primary" onClick={submitNote}>
          Submit
        </Button>
      </div>
      <div>
        <Button
          type="primary"
          shape="round"
          icon={<PictureOutlined />}
          onClick={() => {
            var frame = captureVideoFrame(props.player, "png", 1);
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
    </div>
  );
};

export default NoteTaking;
