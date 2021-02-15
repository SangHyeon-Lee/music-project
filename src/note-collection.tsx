import React, { useState, useEffect, useRef, createRef } from "react";
import firebase from "./firebase";
import { Button, Tag } from "antd";
import { LikeOutlined } from "@ant-design/icons";
import "./note-collection.css";
// import { LeakAddTwoTone } from "@material-ui/icons";
import { useVideoTime } from "./VideoTimeContext";

const { CheckableTag } = Tag;
var db = firebase.firestore();
interface noteCollectionProps {}
const tagsData = ["Awesome", "What If", "What & Why", "Difficult", "Useful"];
// const { Header, Footer, Sider, Content } = Layout;
const NoteCollection: React.FC<noteCollectionProps> = (props) => {
  const ref = db
    .collection("videos")
    .doc("testvideo1")
    .collection("note")
    .orderBy("videoTimestamp");
  var unsubscribe = null;
  const [collection, setCollection] = useState<any[]>([]);
  // const [rightOpen, setRightOpen] = useState(true);
  const [filter, setFilter] = useState<string[]>(tagsData);
  const [filteredCollection, setFilteredCollection] = useState<any[]>(
    collection
  );
  // const [noteLayout, setNoteLayout] = useState<any[]>();
  const refList = useRef<any[]>([]);
  const { videoTime, setVideoTime, videoElement } = useVideoTime()!;
  // var originalCollection = null;
  // console.log(videoTime)

  useEffect(() => {
    unsubscribe = ref.onSnapshot(onCollectionUpdate);
    setFilteredCollection(collection);
    if (filteredCollection) {
      refList.current = refList.current.slice(0, filteredCollection.length);
    }
  }, []);
  const linkToTime = (time: number) => {
    setVideoTime(time);
    videoElement.currentTime = time;
  };
  const Notecomponent = ({ note }: any) => {
    const videoTime_num: number = note.videoTimestamp;
    const min_val: number = Math.floor(videoTime_num / 60);
    const sec_val: number = videoTime_num % 60;
    return (
      <>
        <div className="notecategory">
          <div className={note.category}>{note.category}</div>
          <div onClick={() => linkToTime(videoTime_num)}>
            {min_val}:{sec_val}
          </div>
        </div>
        <div className="singlenote">
          <b className="noteheader">
            {note.userId}
            <Button
              type="primary"
              shape="round"
              icon={<LikeOutlined />}
              size="small"
            />
          </b>
          {note.content}
          <br />
          <img className="noteimg" src={note.downloadURL} alt="" />
        </div>
      </>
    );
  };

  const checkClosest = (currentTime: number) => {
    var data: number[] = [];
    filteredCollection.map((note, i) => data.push(note.videoTimestamp));
    var target = currentTime; //21에 가장 가까운값 찾기
    // var near = 0;
    var abs = 0; //여기에 가까운 수'20'이 들어감
    var min = 10000000; //해당 범위에서 가장 큰 값
    var refIndex = 0;
    //[2] Process
    for (var i = 0; i < data.length; i++) {
      abs = data[i] - target < 0 ? -(data[i] - target) : data[i] - target;

      if (abs < min) {
        min = abs; //MIN
        // near = data[i] //near : 가까운값
        refIndex = i;
      }
    }
    // console.log("InCheckClosest", videoTime,data,currentTime,near,refIndex);
    if (refList.current[refIndex]) {
      refList.current[refIndex].scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
    }
  };

  checkClosest(videoTime);

  const onCollectionUpdate = (querySnapshot: any) => {
    const collection: any = [];
    querySnapshot.forEach((doc: any) => {
      collection.push(doc.data());
    });
    setCollection(collection);
  };

  const handleChange = (tag: string, checked: boolean) => {
    const nextSelectedTags = checked
      ? [...filter, tag]
      : filter.filter((t) => t !== tag);
    setFilter(nextSelectedTags);
    let _filteredCollection = collection.filter((item) => {
      if (
        nextSelectedTags.length > 0 &&
        nextSelectedTags.indexOf(item.category) > -1
      ) {
        return true;
      } else {
        return false;
      }
    });
    // setFilteredCollection(_filteredCollection);
    // console.log("FILT ;", nextSelectedTags, _filteredCollection);
    return _filteredCollection;
  };

  return (
    <div>
      <div className="collection">
        {tagsData.map((tag) => (
          <CheckableTag
            key={tag}
            checked={filter.indexOf(tag) > -1}
            onChange={(checked) =>
              setFilteredCollection(handleChange(tag, checked))
            }
          >
            {tag}
          </CheckableTag>
        ))}
        {filteredCollection.map((note: any, index: any) => (
          <div key={index} ref={(el) => (refList.current[index] = el)}>
            <Notecomponent note={note} key={index} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default NoteCollection;
