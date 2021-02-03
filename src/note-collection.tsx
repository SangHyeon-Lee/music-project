import React from "react";
import firebase from './firebase'
import { Button } from 'antd';
import { LikeOutlined } from '@ant-design/icons';
import './note-collection.css'

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
      rightOpen: true,
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
        <div className='notecategory'>
          <div>{note.category}</div>
          <div>{min_val}:{sec_val}</div>
        </div>
        <div className='singlenote'>
          <b>
             &nbsp;&nbsp; {note.userId}
          </b>
          <br />
          {note.content}
          <br />
          <Button type="primary" shape="round" icon={<LikeOutlined />} size='small'/>
          <img src={note.downloadURL} alt="" />
        </div>
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
      <div>
        <div className={'collection'}>
          {this.state.collection.map((note: any, index: any) => (
            <div>
            <this.Notecomponent note={note} key={index} />
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default NoteCollection;
