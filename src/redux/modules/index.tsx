import { combineReducers } from "redux";
import setVideoTime from "./videoTime";
import setNoteCollection from "./noteCollection";
import setVideoDTime from "./videoDuration";

const rootReducer = combineReducers({
  setVideoTime,
  setNoteCollection,
  setVideoDTime,
});

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;
