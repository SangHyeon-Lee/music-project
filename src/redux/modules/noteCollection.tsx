import firebase from "../../firebase";

var db = firebase.firestore();

const SET_COLLECTION = "noteCollection/SET_COLLECTION" as const;

export const setCollection = (videoName: string, videoDuration: number) => ({
  type: SET_COLLECTION,
  payload: {
    videoName: videoName,
    videoDuration: videoDuration,
  },
});

type setCollectionAction = ReturnType<typeof setCollection>;

type noteCollectionState = {
  noteCollection: any[];
};

const initialState: noteCollectionState = {
  noteCollection: [],
};

// const onCollectionUpdate = (querySnapshot: any) => {
//   // return collection;
// };

function setNoteCollection(
  state: noteCollectionState = initialState,
  action: setCollectionAction
): noteCollectionState {
  switch (action.type) {
    case SET_COLLECTION: {
      const collection: any = [];
      const ref = db
        .collection("videos")
        .doc(action.payload.videoName)
        .collection("note")
        .orderBy("videoTimestamp");
      ref.onSnapshot((snap) => {
        snap.forEach((doc) => {
          //   console.log(
          //     "DATA!",
          //     doc.data().videoTimestamp,
          //     action.payload.videoDuration
          //   );
          if (doc.data().videoTimestamp < action.payload.videoDuration)
            collection.push(doc.data());
        });
      });
      // setTimeout(() => {
      //   console.log()
      // }, 5000); //   console.log("Collection", collection);
      //   const collection = action.noteCollection;
      return { ...state, noteCollection: collection };
    }
    default: {
      return state;
    }
  }
}

export default setNoteCollection;
