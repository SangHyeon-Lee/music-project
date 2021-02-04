import React from "react";
import "./live-note.css";
import { BulbFilled, LikeFilled } from "@ant-design/icons";
import { ReplyRounded } from '@material-ui/icons';
import firebase from "./firebase";

interface liveNoteProps {

}

class LiveNote extends React.Component<liveNoteProps, any> {
    constructor(props: liveNoteProps) {
      super(props);
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
