import { combineReducers } from "redux";
import setVideoTime from "./videoTime";

const rootReducer = combineReducers({
  setVideoTime,
});

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;
