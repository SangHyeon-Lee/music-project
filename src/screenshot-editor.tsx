import React, { useState } from "react";
import { Link, RouteComponentProps, withRouter } from "react-router-dom";
import "tui-image-editor/dist/tui-image-editor.css";
import ImageEditor from "@toast-ui/react-image-editor";
import "./screenshot-editor.css";

interface StateType {
  image: string;
}

type IndexProps = RouteComponentProps<{}, {}, StateType>;

const ScreenshotEditor: React.FC<IndexProps> = ({ location }) => {
  return (
    <div>
      <h2 className='editor-title'>Image Editor</h2>
      <ImageEditor
        includeUI={{
          loadImage: {
            path: location.state.image,
            name: "Screenshot",
          },

          menu: ["draw", "shape", "icon", "text"],
          initMenu: "draw",
          uiSize: {
            width: "1000px",
            height: "800px",
          },
          menuBarPosition: "left",
        }}
        usageStatistics={false}
      />
    </div>
  );
};

export default ScreenshotEditor;
