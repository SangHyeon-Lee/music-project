const SET_TIME = "videoTime/SET_TIME" as const;

export const setTime = (time: number) => ({
  type: SET_TIME,
  videoTime: time,
});

type setTimeAction = ReturnType<typeof setTime>;

type videoTimeState = {
  videoTime: number;
};

const initialState: videoTimeState = {
  videoTime: 0,
};

function setVideoTime(
  state: videoTimeState = initialState,
  action: setTimeAction
): videoTimeState {
  return { videoTime: action.videoTime };
}

export default setVideoTime;
