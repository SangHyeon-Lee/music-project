import React, { useState, useEffect } from "react";
import "./live-note.css";
import { BulbFilled, LikeFilled } from "@ant-design/icons";
import { ReplyRounded } from "@material-ui/icons";
import firebase from "./firebase";
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from './redux/modules';

var db = firebase.firestore();

interface liveNoteProps {}

const LiveNote: React.FC<liveNoteProps> = (props) => {
  const [ref, setRef] = useState(
    db
      .collection("videos")
      .doc("testvideo1")
      .collection("note")
      .orderBy("videoTimestamp")
  );
  var unsubscribe = null;
  const [collection, setCollection] = useState<any[]>([]);

    

  useEffect(() => {
    unsubscribe = ref.onSnapshot(onCollectionUpdate);
  }, []);

  // 나중에 currentTime 받아오면 여기 수정할거라 comment out된 부분 그대로 남겨놔주세요
  const Notecomponent = ({ note }: any) => {
    const videoTime_num: number = note.videoTimestamp;
    const videoNoteContent: string = note.content;
    const min_val: number = Math.floor(videoTime_num / 60);
    const sec_val: number = videoTime_num % 60;
    
    const noteShowingTime = 120;
    
    const videoTime = useSelector((state: RootState) => state.setVideoTime.videoTime);

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

  const onCollectionUpdate = (querySnapshot: any) => {
    const collection: any = [];
    querySnapshot.forEach((doc: any) => {
      collection.push(doc.data());
    });
    setCollection(collection);
  };

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
