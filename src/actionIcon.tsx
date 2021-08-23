import React from "react";
import clipicon from "./assets/icons/clip.png";
import energyicon from "./assets/icons/energy.png";
import suctionicon from "./assets/icons/suction.png";
import stitchicon from "./assets/icons/stitch.png";
import startstopicon from "./assets/icons/startstop.png";
import { NumberOutlined } from "@ant-design/icons";
import { Badge, Space, Switch } from 'antd';
import { Left } from "react-bootstrap/lib/Media";

interface ActionIconProps {
  actionlist: string[];
  actionTime: number[];
}

const ActionIcon: React.FC<ActionIconProps> = ({ actionlist, actionTime }) => {
  const total = actionTime[actionTime.length - 1] - actionTime[0];

  var deltalist: number[] = [];
  for (let i = 0; i < actionTime.length - 1; i++) {
    if (total == 0) {
      deltalist.push(0);
    } else {
      var delta = Math.round(
        ((700 - 32 * actionTime.length) * (actionTime[i + 1] - actionTime[i])) /
          total
      );
      deltalist.push(delta);
    }
  }
  deltalist.push(0);

  const toTimeString = (seconds: number) => {
    return new Date(seconds * 1000).toUTCString().match(/(\d\d:\d\d:\d\d)/)![0];
  };

  function Icon(iconName: any, index: number) {
    var linewidth = `${deltalist[iconName.index]}px`;

    switch (iconName.iconName) {
      case "clip":
        return (
          <div style={{ height: "32px" }}>
            <img src={clipicon} width="32px" style={{ float: "left" }} />
            <hr
              style={{
                float: "right",
                width: linewidth,
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
          <div style={{ height: "32px" }}>
            <img src={energyicon} width="32px" style={{ float: "left" }} />
            <hr
              style={{
                float: "right",
                width: linewidth,
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
          <div style={{ height: "32px" }}>
            <img src={suctionicon} width="32px" style={{ float: "left" }} />
            <hr
              style={{
                float: "right",
                width: linewidth,
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
          <div style={{ height: "32px" }}>
            <img src={stitchicon} width="32px" style={{ float: "left" }} />
            <hr
              style={{
                float: "right",
                width: linewidth,
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
          <div style={{ height: "32px" }}>
            <img
              src={startstopicon}
              width="28px"
              style={{ marginTop: "1px", float: "left" }}
            />
            <hr
              style={{
                float: "right",
                width: linewidth,
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
          <div style={{ height: "32px" }}>
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
      {actionlist.map((actionname: any, index: number, array: any[]) => (
        <div style={{ display: "inline-block", height: "100px" }}>
          <div style={{ fontSize: "10px" }}>
            {toTimeString(actionTime[index])}
          </div>
          <Icon iconName={actionname} index={index} />
          <div>
            <Badge style={{backgroundColor:"#108ee9", top:"5px", left:"6px"}} count={index} showZero />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ActionIcon;
