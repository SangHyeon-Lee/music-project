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

var db = firebase.firestore();

interface NoteIconProps {
  max: number;
  onChange: (progress: number) => void;
}

const NoteIcon: React.FC<NoteIconProps> = ({ max, onChange }) => {
  const videoTime = useSelector(
    (state: RootState) => state.setVideoTime.videoTime
  );

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

  const onCollectionUpdate = (querySnapshot: any) => {
    const collection: any = [];
    querySnapshot.forEach((doc: any) => {
      collection.push(doc.data());
    });
    setCollection(collection);
  };
  const percentNum = (videoTime / max || 0) * 100;
  const percent = `${percentNum}%`;
  const firstStep = 120;
  const secondStep = 90;

  const NoteBubble = ({ note }: any) => {
    const [showNote, setshowNote] = useState(false);
    const [size, setsize] = useState("20px");
    const videoTime_num: number = note.videoTimestamp;

    const notepos = (videoTime_num / max || 0) * 100;
    const fitpos = ((50 - notepos) / 50) * 9; // 9 = radius of controller
    const notepospercent = `${notepos}%`;
    const fitpospx = `${fitpos}px`;
    const notecategory = note.category;
    var bubblecolor = "#FFFFFF";
    switch (notecategory) {
      case "Awesome":
        bubblecolor = "#fff566";
        break;
      case "What If":
        bubblecolor = "#91d5ff";
        break;
      case "Difficult":
        bubblecolor = "#ff7875";
        break;
      case "What & Why":
        bubblecolor = "#95de64";
        break;
    }
    return (
      <div>
        <EnvironmentFilled
          onMouseOver={() => {
            setshowNote(true);
            setsize("25px");
          }}
          onMouseOut={() => {
            setshowNote(false);
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
      case "Awesome":
        return <BulbFilled style={{ fontSize: "20px", color: "#F2C94C" }} />;

      case "What If":
        return (
          <PlusCircleFilled style={{ fontSize: "20px", color: "#40a9ff" }} />
        );

      case "Difficult":
        return <AlertFilled style={{ fontSize: "20px", color: "#ff4d4f" }} />;
      case "What & Why":
        return (
          <QuestionCircleFilled
            style={{ fontSize: "20px", color: "#69c0ff" }}
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
        <div className={styles.reactionscontainer}>
          <div className={styles.reaction}>
            <LikeFilled />
          </div>
          <div className={styles.rotate180}>
            <ReplyRounded />
          </div>
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
    </div>
  );
};

export default NoteIcon;
