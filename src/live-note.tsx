import React, { useState, useEffect } from "react";
import "./live-note.css";
import { BulbFilled, LikeFilled } from "@ant-design/icons";
import { ReplyRounded } from "@material-ui/icons";
import firebase from "./firebase";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "./redux/modules";

var db = firebase.firestore();

interface liveNoteProps {}

const LiveNote: React.FC<liveNoteProps> = (props) => {
  // var unsubscribe = null;
  // const [collection, setCollection] = useState<any[]>([]);
  const collection = useSelector(
    (state: RootState) => state.setNoteCollection.noteCollection
  );
  // useEffect(() => {
  //   // unsubscribe = ref.onSnapshot(onCollectionUpdate);
  // }, []);

  const Notecomponent = ({ note }: any) => {
    const videoTime_num: number = note.videoTimestamp;
    const videoNoteContent: string = note.content;

    const noteShowingTime = 120;

    const videoTime = useSelector(
      (state: RootState) => state.setVideoTime.videoTime
    );

    return (
      <>
        {/* <div className='notecategory'>
          <div>{note.category}</div>
        </div>
        <div className='singlenote'>
          <b>
             &nbsp;&nbsp; {note.userId}
          </b> */}
        {videoTime_num < videoTime + noteShowingTime &&
          videoTime_num > videoTime - noteShowingTime &&
          videoNoteContent}
        {/* <img src={note.downloadURL} alt="" />
        </div> */}
      </>
    );
  };

  // const onCollectionUpdate = (querySnapshot: any) => {
  //   const collection: any = [];
  //   querySnapshot.forEach((doc: any) => {
  //     collection.push(doc.data());
  //   });
  //   setCollection(collection);
  // };

  return (
    <div className="bg">
      <div className="category-bg">
        <BulbFilled style={{ fontSize: "20px", color: "#F2C94C" }} />
        Awesome
      </div>
      <div className="live-note-content">
        This surgeon uses a round needle instead of V-lock.
        <div>
          {collection.map((note: any, index: any) => (
            <div>
              <Notecomponent note={note} key={index} />
            </div>
          ))}
        </div>
      </div>
      <div className="reactions-container">
        <div className="reaction">
          <LikeFilled />
        </div>
        <div className="reaction rotate-180">
          <ReplyRounded />
        </div>
      </div>
    </div>
  );
};

export default LiveNote;
