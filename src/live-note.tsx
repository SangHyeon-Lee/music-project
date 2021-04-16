import React, { useState, useEffect } from "react";
import "./live-note.css";
import { ReplyRounded } from "@material-ui/icons";
import firebase from "./firebase";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "./redux/modules";
import styles from "./progressBar.module.css";
import {
  EnvironmentFilled,
  BulbFilled,
  LikeFilled,
  AlertFilled,
  QuestionCircleFilled,
  PlusCircleFilled,
} from "@ant-design/icons";

var db = firebase.firestore();

interface liveNoteProps {}

const LiveNote: React.FC<liveNoteProps> = (props) => {
  const collection = useSelector(
    (state: RootState) => state.setNoteCollection.noteCollection
  );


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
  const Notecomponent = ({ note }: any) => {
    const videoTime_num: number = note.videoTimestamp;
    const videoNoteContent: string = note.content;

    const noteShowingTime = 120;

    const videoTime = useSelector(
      (state: RootState) => state.setVideoTime.videoTime
    );

    return (
      <div className={styles.livenotecontent}>
        {videoTime_num < videoTime + noteShowingTime &&
          videoTime_num > videoTime - noteShowingTime &&
          videoNoteContent}
      </div>
    );
  };

  return (
    <div className="bg">
      <div className="category-bg">
        <BulbFilled style={{ fontSize: "20px", color: "#F2C94C" }} />
      </div>
      <div className={styles.livenotecontent}>
        <div>
          {collection.map((note: any, index: any) => (
            <div>
              <Notecomponent note={note} key={index} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LiveNote;
