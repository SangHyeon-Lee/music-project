import React, { useState } from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import "./App.css";
import NoteCollection from "./note-collection";
import { Button, Drawer, IconButton } from "@material-ui/core";
import { Menu, ChevronRight, ChevronLeft } from "@material-ui/icons";
import Video from "./Video";
import { VideoElementProvider } from "./VideoElementContext";


const drawerWidth = 360;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  appBar: {
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: drawerWidth,
  },
  title: {
    flexGrow: 1,
  },
  open: {
    position: "fixed",
    right: "-25px",
    margin: "auto",
    writingMode: "vertical-rl",
    textOrientation: "mixed",
    // position: "fixed",
    top: "20%",
    width: "70px",
    height: "250px",
    float: "left",
    fontSize: "1.5em",
    // fontWeight: "bold",
    // backgroundColor: "#fcf59b",
    // // borderRadius: "0px 10px 250px / 0 200px 55px 250px",
    // borderRight: "50px solid #555",
    // borderTop: "25px solid transparent",
    // borderBottom: "25px solid transparent",
    // WebkitBoxShadow: "-3px 5px 12px 0 rgba(0,0,0,0.3)",
    // MozBoxShadow: "-3px 5px 12px 0 rgba(0,0,0,0.3)",
    // boxShadow: "-3px 5px 12px 0 rgba(0,0,0,0.3)",
    //-ms-transform: rotateZ(-4deg),
    //-webkit-transform: rotateZ(-4deg),
    //transform: rotateZ(-4deg),
  },
  hide: {
    display: "none",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: "flex-start",
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginRight: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: 0,
  },
  viewNotes: {
    position: "fixed",
    right: "18px",
    margin: "auto",
    writingMode: "vertical-rl",
    textOrientation: "mixed",
    // position: "fixed",
    top: "20%",
    width: "70px",
    height: "250px",
    float: "left",
    fontSize: "1em",
  },
}));

interface AppProps {
  history?: any;
}

const App: React.FC<AppProps> = (props) => {
  const [open, setOpen] = React.useState(false);
  const classes = useStyles();

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <VideoElementProvider>
        <div className="appbody">
          <div
            className={clsx(classes.content, {
              [classes.contentShift]: open,
            })}
          >
            <Video src="https://firebasestorage.googleapis.com/v0/b/kixlab-music.appspot.com/o/videos%2FConductor_Tom.mp4?alt=media&token=cffa42de-effd-4b56-a16d-00967ec730bf" />
          </div>
        </div>
        
      </VideoElementProvider>
    </div>
  );
};

export default App;
