import React, { useState, useEffect } from "react";
import firebase from './firebase'
import { Button, Tag } from 'antd';
import { LikeOutlined } from '@ant-design/icons';
import './note-collection.css'
import { LeakAddTwoTone } from "@material-ui/icons";

const { CheckableTag } = Tag;
var db = firebase.firestore();
interface noteCollectionProps {}
const tagsData = ['Awesome', 'What If', 'What & Why', 'Difficult', 'Useful'];

const NoteCollection: React.FC<noteCollectionProps> = (props) => {
  const [ref, setRef] = useState(db
                                  .collection("videos")
                                  .doc("testvideo1")
                                  .collection("note")
                                  .orderBy("videoTimestamp"));
  var unsubscribe = null;
  const [collection, setCollection] = useState<any[]>([]);
  const [rightOpen, setRightOpen] = useState(true);
  const [filter, setFilter] = useState<string[]>([]);
  const [filteredCollection, setFilteredCollection] = useState<any[]>(collection)
  const [noteLayout, setNoteLayout] = useState<any[]>();
  // var originalCollection = null;

  useEffect(
    () => {
      unsubscribe = ref.onSnapshot(onCollectionUpdate);
    }, []
  );
  
  const Notecomponent = ({ note }: any) => {
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



  const onCollectionUpdate = (querySnapshot: any) => {
    const collection: any = [];
    querySnapshot.forEach((doc: any) => {
      collection.push(doc.data());
    });
    setCollection(collection)
  };

  const handleChange = (tag:string, checked:boolean) => {
    const nextSelectedTags = checked ? [...filter, tag] : filter.filter(t => t !== tag);
    setFilter(nextSelectedTags);
    let _filteredCollection = collection.filter(item => {
            if(nextSelectedTags.length > 0 && (nextSelectedTags.indexOf(item.category) > -1)) {
              return true
            } else {
              return false
            }
          });
    // setFilteredCollection(_filteredCollection);
    return _filteredCollection;
  }
  return (
    <div>
      <div className={'collection'}>
        <span style={{ marginRight: 8 }}>Categories:</span>
              {tagsData.map(tag => (
                <CheckableTag
                  key={tag}
                  checked={filter.indexOf(tag) > -1}
                  onChange={checked => setFilteredCollection(handleChange(tag, checked))}
                >
                  {tag}
                </CheckableTag>
              ))}
        {filteredCollection.map((note: any, index: any) => (
          <div>
            <Notecomponent note={note} key={index} />
          </div>
        ))}
      </div>
    </div>
  );
};


export default NoteCollection;
