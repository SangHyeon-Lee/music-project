const SET_DTIME = "videoDuration/SET_DTIME" as const;

export const setDTime = (time: number) => ({
  type: SET_DTIME,
  videoDuration: time,
});

type setTimeAction = ReturnType<typeof setDTime>;

type videoDurationState = {
  videoDuration: number;
};

const initialState: videoDurationState = {
  videoDuration: 0,
};

function setVideoDTime(
  state: videoDurationState = initialState,
  action: setTimeAction
): videoDurationState {
  switch (action.type) {
    case SET_DTIME: {
      return { ...state, videoDuration: action.videoDuration };
    }
    default: {
      return state;
    }
  }
}

export default setVideoDTime;
