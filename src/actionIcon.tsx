import React from "react";
import clipicon from "./assets/icons/clip.png";
import energyicon from "./assets/icons/energy.png";
import suctionicon from "./assets/icons/suction.png";
import stitchicon from "./assets/icons/stitch.png";
import startstopicon from "./assets/icons/startstop.png";

interface ActionIconProps {
    iconName: string;
}

const ActionIcon: React.FC<ActionIconProps> = ({
    iconName
}) => {

    const icon: string = iconName;
    
    function Icon(iconName: any){
        console.log(JSON.stringify(iconName));
        switch (iconName.iconName){
            case"clip":
                console.log("clip");
                return <img src={clipicon} width="32px" />;
            case "energy":
                return <img src={energyicon} width="32px" />;
            case "suction":
                return <img src={suctionicon} width="32px" />;
            case "stitch":
                return <img src={stitchicon} width="32px" />;
            default:
                return <img src={startstopicon} width="28px" />;
        }
    }

    return(
        <div>
            <Icon iconName={icon} />
        </div>
        
    );

};

export default ActionIcon;