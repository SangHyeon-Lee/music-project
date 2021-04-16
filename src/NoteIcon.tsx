import classNames from "classnames";
import React, { useState, useEffect } from "react";
import styles from "./progressBar.module.css";
import {
  EnvironmentFilled,
  BulbFilled,
  LikeFilled,
  AlertFilled,
  QuestionCircleFilled,
  PlusCircleFilled,
} from "@ant-design/icons";
import { ReplyRounded } from "@material-ui/icons";
import firebase from "./firebase";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "./redux/modules";
import LiveNote from "./live-note"

var db = firebase.firestore();

interface NoteIconProps {
  max: number;
  onChange: (progress: number) => void;

}

const NoteIcon: React.FC<NoteIconProps> = ({ max, onChange}) => {
  const videoTime = useSelector(
    (state: RootState) => state.setVideoTime.videoTime
  );

  // const [ref, setRef] = useState(
  //   db
  //     .collection("videos")
  //     .doc("testvideo1")
  //     .collection("note")
  //     .orderBy("videoTimestamp")
  // );
  // var unsubscribe = null;
  const collection = useSelector(
    (state: RootState) => state.setNoteCollection.noteCollection
  );

  useEffect(() => {
    // unsubscribe = ref.onSnapshot(onCollectionUpdate);
  }, []);

  // const onCollectionUpdate = (querySnapshot: any) => {
  //   const collection: any = [];
  //   querySnapshot.forEach((doc: any) => {
  //     collection.push(doc.data());
  //   });
  //   setCollection(collection);
  // };
  const percentNum = (videoTime / max || 0) * 100;
  const percent = `${percentNum}%`;
  const firstStep = 120;
  const secondStep = 90;

  const [showLiveNote, setshowLiveNote] = useState(true);

  const NoteBubble = ({ note }: any) => {
    
    const [size, setsize] = useState("20px");
    const videoTime_num: number = note.videoTimestamp;
    const [showNote, setshowNote] = useState(false);
    const notepos = (videoTime_num / max || 0) * 100;
    const fitpos = ((50 - notepos) / 50) * 9; // 9 = radius of controller
    const notepospercent = `${notepos}%`;
    const fitpospx = `${fitpos}px`;
    const notecategory = note.category;
    var bubblecolor = "#FFFFFF";
    switch (notecategory) {
      case "Challenging":
        bubblecolor = "#fff566";
        break;
      case "Skill":
        bubblecolor = "#91d5ff";
        break;
      case "Distinctive":
        bubblecolor = "#ff7875";
        break;
      case "Opportunity":
        bubblecolor = "#95de64";
        break;
      case "Others":
        bubblecolor = "#324232";
        break;
    }
    return (
      <div>
        <EnvironmentFilled
          onMouseOver={() => {
            setshowNote(true);
            setshowLiveNote(false);
            setsize("25px");
          }}
          onMouseOut={() => {
            setshowNote(false);
            setshowLiveNote(true);
            setsize("20px");
          }}
          onClick={() => {
            onChange((note.videoTimestamp / max) * 100);
          }}
          className={styles.noteicon}
          style={{
            left: `calc(${notepospercent} + ${fitpospx})`,
            bottom: "10px",
            fontSize: size,
            color: bubblecolor,
          }}
        />
        {showNote && <ShowNote note={note} />}
      </div>
    );
  };
  function Icon(category: any) {
    switch (category.category) {
      case "Challenging":
        return <BulbFilled style={{ fontSize: "20px", color: "#F2C94C" }} />;

      case "Skill":
        return (
          <PlusCircleFilled style={{ fontSize: "20px", color: "#40a9ff" }} />
        );

      case "Distinctive":
        return <AlertFilled style={{ fontSize: "20px", color: "#ff4d4f" }} />;
      case "Opportunity":
        return (
          <QuestionCircleFilled
            style={{ fontSize: "20px", color: "#95de64 " }}
          />
        );

      default:
        return (
          <QuestionCircleFilled
            style={{ fontSize: "20px", color: "#F2C94C" }}
          />
        );
    }
  }

  const ShowNote = ({ note }: any) => {
    return (
      <div className={styles.notecontainer}>
        <div className={styles.categorybg}>
          <Icon category={note.category} />
          <div>{note.category}</div>
        </div>
        <div className={styles.livenotecontent}>
          <div>{note.content}</div>
        </div>
        
      </div>
    );
  };
  return (
    <div>
      {collection.map((note: any, index: any) => (
        <div>
          <NoteBubble
            note={note}
            key={index}
            style={{ position: "relative" }}
          />
        </div>
      ))}
      {/* {showLiveNote && <LiveNote/>} */}
    </div>
  );
};

export default NoteIcon;
