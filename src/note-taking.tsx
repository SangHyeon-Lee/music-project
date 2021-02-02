import React from "react";
import { Editor, EditorState } from "draft-js";
import "draft-js/dist/Draft.css";
import "./note-taking.css";
import { Button, Radio } from "antd";
import firebase from "./firebase";
import { v4 as uuid } from "uuid";

var db = firebase.firestore();
var storage = firebase.storage();
interface noteTakingProps {
  userId: string;
  timestamp: number;
  screenshot: any;
}

class NoteTaking extends React.Component<noteTakingProps, any> {
  constructor(props: noteTakingProps) {
    super(props);

    this.state = { editorState: EditorState.createEmpty() };
    this.handleChange = this.handleChange.bind(this);
    this.submitNote = this.submitNote.bind(this);
  }

  handleChange(e: EditorState) {
    this.setState({ editorState: e });
  }
  submitNote(): any {
    const noteCollection = db
      .collection("videos")
      .doc("testvideo1")
      .collection("note");
    //console.log(this.props.screenshot);

    const id: string = uuid();
    const ref: string = "screenshots/" + id + ".png";

    if (this.props.screenshot != null) {
      storage
        .ref(ref)
        .putString(this.props.screenshot, "data_url")
        .then((snapshot) =>
          snapshot.ref.getDownloadURL().then((downloadURL) => {
            console.log("download:    ", downloadURL);
            noteCollection.add({
              category: "Useful",
              content: this.state.editorState
                .getCurrentContent()
                .getPlainText("\u0001"),
              //timestamp: "",
              userId: this.props.userId,
              videoTimestamp: this.props.timestamp,
              downloadURL: downloadURL,
            });
          })
        );
    } else {
      noteCollection.add({
        category: "Useful",
        content: this.state.editorState
          .getCurrentContent()
          .getPlainText("\u0001"),
        //timestamp: "",
        userId: this.props.userId,
        videoTimestamp: this.props.timestamp,
        downloadURL: "nodownload",
      });
      console.log(
        this.state.editorState.getCurrentContent().getPlainText("\u0001")
      );
    }
  }
  onChange(e: any) {
    console.log(`radio checked:${e.target.value}`);
  }

  render() {
    return (
      <>
        <Radio.Group
          className="category-group"
          onChange={this.onChange}
          defaultValue="a"
        >
          <Radio.Button className="category-entry" value="a">
            Awesome
          </Radio.Button>
          <Radio.Button className="category-entry" value="b">
            What If
          </Radio.Button>
          <Radio.Button className="category-entry" value="c">
            What & Why
          </Radio.Button>
          <Radio.Button className="category-entry" value="d">
            Difficult
          </Radio.Button>
        </Radio.Group>
        <div className="draft-root">
          <Editor
            editorState={this.state.editorState}
            onChange={(e) => this.handleChange(e)}
          />
          <Button type="primary" onClick={this.submitNote}>
            Submit
          </Button>
        </div>
      </>
    );
  }
}

export default NoteTaking;
