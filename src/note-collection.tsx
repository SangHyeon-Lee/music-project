import React, { useState, useEffect, useRef, createRef } from "react";
import firebase from "./firebase";
import { Button, Tag } from "antd";
import { LikeOutlined } from "@ant-design/icons";
import "./note-collection.css";
// import { LeakAddTwoTone } from "@material-ui/icons";
import { useVideoElement } from "./VideoElementContext";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "./redux/modules";
import { setTime } from "./redux/modules/videoTime";
import { ViewArrayOutlined } from "@material-ui/icons";

const toTimeString = (seconds: number) => {
  return new Date(seconds * 1000).toUTCString().match(/(\d\d:\d\d:\d\d)/)![0];
};

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
  // var unsubscribe = null;
  const [collection, setCollection] = useState<any[]>([]);
  // const [rightOpen, setRightOpen] = useState(true);
  const [filter, setFilter] = useState<string[]>(tagsData);
  const [filteredCollection, setFilteredCollection] = useState<any[]>(
    collection
  );
  // const [noteLayout, setNoteLayout] = useState<any[]>();
  const refList = useRef<any[]>([]);
  const { videoElement } = useVideoElement()!;

  const videoTime = useSelector(
    (state: RootState) => state.setVideoTime.videoTime
  );
  const dispatch = useDispatch();

  const setVideoTime = (time: number) => {
    dispatch(setTime(time));
  };

  const [prevFocusedTime, setPrevFocusedTime] = useState<number>(0);
  // var originalCollection = null;
  // console.log(videoTime)

  useEffect(() => {
    const unsubscribe = ref.onSnapshot((snap) => {
      if (collection.length === 0) {
        const _collection: any = [];
        snap.forEach((doc: any) => {
          _collection.push(doc.data());
        });
        setCollection(_collection);
        setFilteredCollection(_collection);
        console.log("onCollectionUpdate", _collection);
      }
    });
    if (filteredCollection) {
      refList.current = refList.current.slice(0, filteredCollection.length);
    }
    // console.log("inUseEffect", filteredCollection, collection);
    return () => unsubscribe();
  }, [collection, filteredCollection, ref]);

  const linkToTime = (time: number) => {
    setVideoTime(time);
    setPrevFocusedTime(time);
    checkClosest(time);
    videoElement.currentTime = time;
  };
  const Notecomponent = ({ note }: any) => {
    const videoTime_num: number = note.videoTimestamp;
    const min_val: number = Math.floor(videoTime_num / 60);
    const sec_val: number = videoTime_num % 60;
    const time_str: string = toTimeString(videoTime_num);
    return (
      <>
        <div className="notecategory">
          <div className={note.category}>{note.category}</div>
          <div onClick={() => linkToTime(videoTime_num)}>{time_str}</div>
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
          {note.downloadURL && (
            <img className="noteimg" src={note.downloadURL} alt="" />
          )}
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
  if (videoTime - prevFocusedTime > 10) {
    console.log("FOCUS!!", videoTime, prevFocusedTime);
    checkClosest(videoTime);
    setPrevFocusedTime(videoTime);
  }

  const onCollectionUpdate = (querySnapshot: any) => {
    const _collection: any = [];
    querySnapshot.forEach((doc: any) => {
      _collection.push(doc.data());
    });
    setCollection(_collection);
    console.log("onCollectionUpdate", _collection);
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
        <div className="category">
          Choose Category: 
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
        </div>
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
