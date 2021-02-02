import React from "react";
import { Editor, EditorState } from "draft-js";
import "draft-js/dist/Draft.css";
import "./note-taking.css";
import { Button } from "antd";
import firebase from './firebase'
var db = firebase.firestore();
interface noteTakingProps {
  userId: string;
  timestamp: number;
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
    noteCollection.add({
      category: "Useful",
      content: this.state.editorState
        .getCurrentContent()
        .getPlainText("\u0001"),
      //timestamp: "",
      userId: this.props.userId,
      videoTimestamp: this.props.timestamp,
    });
    console.log(
      this.state.editorState.getCurrentContent().getPlainText("\u0001")
    );
  }

  render() {
    return (
      <div className="draft-root">
        <Editor
          placeholder = "type your note here!"
          editorState={this.state.editorState}
          onChange={(e) => this.handleChange(e)}
        />
        <Button type="primary" onClick={this.submitNote}>
          Submit
        </Button>
      </div>
    );
  }
}

export default NoteTaking;
