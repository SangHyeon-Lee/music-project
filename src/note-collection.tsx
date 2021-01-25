import React from "react";
import firebase from './firebase'
var db = firebase.firestore();
interface noteCollectionProps {}

class NoteCollection extends React.Component<noteCollectionProps, any> {
  constructor(props: noteCollectionProps) {
    super(props);

    this.ref = db
      .collection("videos")
      .doc("testvideo1")
      .collection("note")
      .orderBy("videoTimestamp");
    this.unsubscribe = null;
    this.state = {
      collection: [],
    };
  }
  ref: any;
  unsubscribe: any;

  Notecomponent({ note }: any) {
    const videoTime_num: number = note.videoTimestamp;
    const min_val: number = Math.floor(videoTime_num / 60);
    const sec_val: number = videoTime_num % 60;
    return (
      <div>
        <b>
          {min_val}:{sec_val} &nbsp;&nbsp; {note.userId}
        </b>
        <br />
        {note.category}
        <br />
        {note.content}
        <br />
        &nbsp;
      </div>
    );
  }

  onCollectionUpdate = (querySnapshot: any) => {
    const collection: any = [];
    querySnapshot.forEach((doc: any) => {
      collection.push(doc.data());
    });
    this.setState({
      collection,
    });
  };

  componentDidMount() {
    this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate);
  }

  render() {
    return (
      <div>
        {this.state.collection.map((note: any, index: any) => (
          <this.Notecomponent note={note} key={index} />
        ))}
      </div>
    );
  }
}

export default NoteCollection;
