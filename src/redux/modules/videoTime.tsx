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
  switch (action.type) {
    case SET_TIME: {
      return { videoTime: action.videoTime };
    }
    default: {
      return state;
    }
  }
}

export default setVideoTime;
