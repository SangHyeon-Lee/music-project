import React from "react";
import clipicon from "./assets/icons/clip.png";
import energyicon from "./assets/icons/energy.png";
import suctionicon from "./assets/icons/suction.png";
import stitchicon from "./assets/icons/stitch.png";
import startstopicon from "./assets/icons/startstop.png";

interface ActionIconProps {
  actionlist: string[];
  actionTime: number[];
}

const ActionIcon: React.FC<ActionIconProps> = ({ actionlist, actionTime }) => {
  function Icon(iconName: any) {
    switch (iconName.iconName) {
      case "clip":
        console.log("clip");
        return (
          <div>
            <img src={clipicon} width="32px" style={{ float: "left" }} />
            <hr
              style={{
                float: "right",
                width: "32px",
                marginTop: "15px",
                backgroundColor: "#1890ff",
                border: "0px",
                height: "2px",
              }}
            />
          </div>
        );
      case "energy":
        return (
          <div>
            <img src={energyicon} width="32px" style={{ float: "left" }} />
            <hr
              style={{
                float: "right",
                width: "32px",
                marginTop: "15px",
                backgroundColor: "#1890ff",
                border: "0px",
                height: "2px",
              }}
            />
          </div>
        );
      case "suction":
        return (
          <div>
            <img src={suctionicon} width="32px" style={{ float: "left" }} />
            <hr
              style={{
                float: "right",
                width: "32px",
                marginTop: "15px",
                backgroundColor: "#1890ff",
                border: "0px",
                height: "2px",
              }}
            />
          </div>
        );
      case "stitch":
        return (
          <div>
            <img src={stitchicon} width="32px" style={{ float: "left" }} />
            <hr
              style={{
                float: "right",
                width: "32px",
                marginTop: "15px",
                backgroundColor: "#1890ff",
                border: "0px",
                height: "2px",
              }}
            />
          </div>
        );
      case "start":
        return (
          <div>
            <img
              src={startstopicon}
              width="28px"
              style={{ marginTop: "1px", float: "left" }}
            />
            <hr
              style={{
                float: "right",
                width: "32px",
                marginTop: "15px",
                backgroundColor: "#1890ff",
                border: "0px",
                height: "2px",
              }}
            />
          </div>
        );
      default:
        return (
          <div>
            <img
              src={startstopicon}
              width="28px"
              style={{ marginTop: "1px", float: "left" }}
            />
          </div>
        );
    }
  }

  return (
    <div>
      {actionlist.map((actionname: any) => (
        <div style={{ display: "inline-block", height: "32px" }}>
          <Icon iconName={actionname} />
        </div>
      ))}
    </div>
  );
};

export default ActionIcon;
