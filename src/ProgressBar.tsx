import classNames from "classnames";
import React from "react";

import styles from "./progressBar.module.css";
import { EnvironmentTwoTone } from "@ant-design/icons";

interface IProps {
  max: number;
  value: number;
  className?: string;
  onChange: (progress: number) => void;
  onMouseDown: () => void;
  onMouseUp: () => void;
}

const ProgressBar: React.FC<IProps> = ({
  max,
  value,
  className,
  onChange,
  onMouseDown,
  onMouseUp,
}) => {
  const classProps = classNames(styles.default, className);
  const percentNum = (value / max || 0) * 100;
  const percent = `${percentNum}%`;
  const firstStep = 120;
  const secondStep = 90;

  const notepos = "3px";

  return (
    <div className={classProps}>
      <div className={styles.stepContainer}>
        <EnvironmentTwoTone
          className={styles.noteicon}
          style={{ left: notepos, fontSize: "20px" }}
        />
        <div className={styles.step} style={{ width: firstStep }}>
          {/* <span className={styles.tooltip} style={{ marginLeft: -firstStep/2 }}>
              First Step</span> */}
        </div>
        <div className={styles.step} style={{ width: secondStep }}>
          {/* <span className={styles.tooltip} style={{ marginLeft: -secondStep/2 }}>
              Second Step</span> */}
        </div>
        <div className={styles.step} style={{ width: secondStep }}>
          {/* <span className={styles.tooltip} style={{ marginLeft: -secondStep/2 }}>
              Second Step</span> */}
        </div>
      </div>
      <div className={styles.bgBar}>
        <div className={styles.bar} style={{ width: percent }}>
          <input
            onChange={(e) => onChange(parseInt(e.target.value, 10))}
            onTouchStart={onMouseDown}
            onTouchEnd={onMouseUp}
            type="range"
            min="0"
            max="100"
            step="1"
            value={percentNum}
            className={styles.controller}
          />
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
