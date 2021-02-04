import React from "react";
import "./live-note.css";
import { BulbFilled, LikeFilled } from "@ant-design/icons";
import { ReplyRounded } from '@material-ui/icons';
import firebase from "./firebase";

var db = firebase.firestore();
interface liveNoteProps {}

class LiveNote extends React.Component<liveNoteProps, any> {
  constructor(props: liveNoteProps) {
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
      <>
        {/* <div className='notecategory'>
          <div>{note.category}</div>
        </div>
        <div className='singlenote'>
          <b>
             &nbsp;&nbsp; {note.userId}
          </b> */}
          {videoTime_num}
          {note.content}
          {/* <img src={note.downloadURL} alt="" />
        </div> */}
      </>
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
        <div className = "bg">
            <div className = "category-bg">
                <BulbFilled style={{ fontSize: '20px', color: "#F2C94C"}}/>
                Awesome
            </div>
            <div className = "live-note-content">
                This surgeon uses a round needle instead of V-lock.
                This surgeon uses a round needle instead of V-lock.
                <div className={'collection'}>
                  {this.state.collection.map((note: any, index: any) => (
                    <div>
                    <this.Notecomponent note={note} key={index} />
                    </div>
                  ))}
                </div>
            </div>
            <div className = "reactions-container">
              <div className = "reaction">
                <LikeFilled />
              </div>
              <div className = "reaction rotate-180">
                <ReplyRounded />
              </div>
            </div>
        </div>
    );
  }
}

export default LiveNote;
