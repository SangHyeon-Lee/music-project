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
import { setCollectionFromDB } from "./redux/modules/noteCollection";
import { ViewArrayOutlined } from "@material-ui/icons";
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import StarBorderSharpIcon from '@material-ui/icons/StarBorderSharp';
import StarIcon from '@material-ui/icons/Star';
import ReportProblemOutlinedIcon from '@material-ui/icons/ReportProblemOutlined';
import WarningIcon from '@material-ui/icons/Warning';
import EmojiObjectsOutlinedIcon from '@material-ui/icons/EmojiObjectsOutlined';
import EmojiObjectsIcon from '@material-ui/icons/EmojiObjects';
import FlagOutlinedIcon from '@material-ui/icons/FlagOutlined';
import FlagIcon from '@material-ui/icons/Flag';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import HelpIcon from '@material-ui/icons/Help';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import { purple } from '@material-ui/core/colors';
import Tooltip from '@material-ui/core/Tooltip';

const toTimeString = (seconds: number) => {
  return new Date(seconds * 1000).toUTCString().match(/(\d\d:\d\d:\d\d)/)![0];
};

const { CheckableTag } = Tag;
interface noteCollectionProps {}
const tagsData = ["Challenging", "Skill", "Distinctive", "Opportunity", "Others"];
const tagsCheckedIcon = [<FlagIcon style={{ color: '#f44336' }}/>,
                         <StarIcon style={{ color: '#4791db' }}/>,
                         <EmojiObjectsIcon style={{ color: '#ffc107' }}/>,
                         <WarningIcon style={{ color: '#59af28' }}/>,
                         <HelpIcon style={{ color: '#bdbdbd' }}/>];
const tagsIcon = [<FlagOutlinedIcon />, <StarBorderSharpIcon />, <EmojiObjectsOutlinedIcon />, <ReportProblemOutlinedIcon />, <HelpOutlineIcon />];
const tagsColor:Array<any> = ["primary","secondary","error","warning","success"]
// const { Header, Footer, Sider, Content } = Layout;

// const theme = createMuiTheme({
//   palette: {
//     primary: {
//       // Purple and green play nicely together.
//       main: '#e33371',
//     },
//     secondary: {
//       // This is green.A700 as hex.
//       main: '#4791db',
//     },
//     error: {
//       // This is green.A700 as hex.
//       main: '#ffb74d',
//     },
//     warning: {
//       // This is green.A700 as hex.
//       main: '#11cb5f',
//     },
//     success: {
//       // This is green.A700 as hex.
//       main: '#11cb5f',
//     },
//   },
// });


const NoteCollection: React.FC<noteCollectionProps> = (props) => {
  // const ref = db
  //   .collection("videos")
  //   .doc("testvideo1")
  //   .collection("note")
  //   .orderBy("videoTimestamp");
  // var unsubscribe = null;
  // const [collection, setCollection] = useState<any[]>([]);
  // const [rightOpen, setRightOpen] = useState(true);
  const collection = useSelector(
    (state: RootState) => state.setNoteCollection.noteCollection
  );

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
  const videoDTime = useSelector(
    (state: RootState) => state.setVideoDTime.videoDuration
  );
  const dispatch = useDispatch();

  const setVideoTime = (time: number) => {
    dispatch(setTime(time));
  };

  const [prevFocusedTime, setPrevFocusedTime] = useState<number>(0);
  // var originalCollection = null;
  // console.log(videoTime)

  useEffect(() => {
    // const unsubscribe = ref.onSnapshot((snap) => {
    //   if (collection.length === 0) {
    //     const _collection: any = [];
    //     snap.forEach((doc: any) => {
    //       _collection.push(doc.data());
    //     });
    //     setCollection(_collection);
    //     setFilteredCollection(_collection);
    //     console.log("onCollectionUpdate", _collection);
    //   }
    // });
    dispatch(setCollectionFromDB("testvideo1", videoDTime));
    // setFilteredCollection(collection);

    // console.log("inUseEffect", videoDTime);
  }, [dispatch, videoDTime]);

  useEffect(() => {
    setFilteredCollection(collection);
  }, [collection]);

  useEffect(() => {
    if (filteredCollection) {
      refList.current = refList.current.slice(0, filteredCollection.length);
      console.log(refList, filteredCollection);
    }
  }, [collection, filteredCollection]);

  const linkToTime = (time: number) => {
    setVideoTime(time);
    setPrevFocusedTime(time);
    checkClosest(time);
    videoElement.currentTime = time;
  };
  const Notecomponent = ({ note }: any) => {
    const [likes, setLikes] = useState(0);
    const videoTime_num: number = note.videoTimestamp;
    const noteCategory: string = note.category;
    const noteCategoryList: string[] = noteCategory.split(" ");
    const noteCategoryClassName: string = noteCategoryList[
      noteCategoryList.length - 1
    ].toLowerCase();
    const time_str: string = toTimeString(videoTime_num);

    const onClickLikeButton = () => {
      setLikes((prev) => prev + 1);
    };
    return (
      <>
        <div className="notecategory">
          <div className={noteCategoryClassName}>{noteCategory}</div>
          <div onClick={() => linkToTime(videoTime_num)}>
            <a href="#">({time_str})</a>
          </div>
        </div>
        <div className="singlenote">
          <b className="noteheader">
            {note.userId}
            {/* <div style={{fontWeight: "normal", color: "rgb(4, 22, 54)", position: "relative", marginLeft: "180px"}}>{likes}</div>
            <Button
              type="primary"
              shape="round"
              icon={<LikeOutlined />}
              size="small"
              onClick={onClickLikeButton}
            /> */}
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

  // const onCollectionUpdate = (querySnapshot: any) => {
  //   const _collection: any = [];
  //   querySnapshot.forEach((doc: any) => {
  //     _collection.push(doc.data());
  //   });
  //   setCollection(_collection);
  //   console.log("onCollectionUpdate", _collection);
  // };

  const handleChange = (tag: string, checked: boolean) => {
    const nextSelectedTags = checked
      ? [...filter, tag]
      : filter.filter((t) => t !== tag);
    setFilter(nextSelectedTags);
    let _filteredCollection = collection.filter((item: any) => {
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
    console.log("FILT ;", nextSelectedTags, _filteredCollection);
    return _filteredCollection;
  };

  return (
    <div>
      <div className="coll-category">
        <FormGroup row>
        {tagsData.map((tag) => (
          <Tooltip title={<h2 style={{ color: "white" }}>{tag}</h2>} arrow>
          <FormControlLabel
            className="category-entry"
            control={
              <Checkbox
                icon={tagsIcon[tagsData.indexOf(tag)]}
                checkedIcon={tagsCheckedIcon[tagsData.indexOf(tag)]}
                checked={filter.indexOf(tag) > -1}
                onChange={(checked) => {
                  setFilteredCollection(handleChange(tag, checked.target.checked))
                }}
                
                // color={"primary"}
                //{<span style={{ fontSize: '0.9rem' }}>{tag}</span>}
                name={tag}
              />}
            label=""
          />
          </Tooltip>
        ))}
        </FormGroup>
      </div>
      <div className="collection">
        {tagsData === filter
          ? collection.map((note: any, index: any) => (
              <div key={index} ref={(el) => (refList.current[index] = el)}>
                <Notecomponent note={note} key={index} />
              </div>
            ))
          : filteredCollection.map((note: any, index: any) => (
              <div key={index} ref={(el) => (refList.current[index] = el)}>
                <Notecomponent note={note} key={index} />
              </div>
            ))}
      </div>
    </div>
  );
};

export default NoteCollection;
