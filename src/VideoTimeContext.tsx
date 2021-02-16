import React, { useContext } from 'react'

const VideoTimeContext = React.createContext<VideoTimeContextType | undefined>(undefined);
const VideoElementContext = React.createContext<VideoElementContextType | undefined>(undefined);
type VideoTimeContextType = { 
    videoTime: number;
    setVideoTime: (value: number) => void;
    videoElement: HTMLVideoElement|any;
    setVideoElement: (value: HTMLVideoElement|any) => void;
};

type VideoElementContextType = {

}

export const useVideoTime = () => React.useContext(VideoTimeContext);
export const useVideoElement = () => React.useContext(VideoElementContext)
export const VideoTimeProvider = ({ children }: { children: React.ReactNode }) => {
    const [videoTime, setVideoTime] = React.useState(0);
    const [videoElement, setVideoElement] = React.useState(null);
    React.useEffect(() => {
        const currentTime = 0;
        setVideoTime(currentTime);
        setVideoElement(null);
    }, []);

    return (
        <VideoTimeContext.Provider value={{ videoTime, setVideoTime, videoElement, setVideoElement }}>
            {children}
        </VideoTimeContext.Provider>
    )
};

// export const VideoElementProvider = ({ children }: { children: React.ReactNode }) => {


//     React.useEffect(() => {
//         // const currentTime = 0;
//     }, []);

//     return (
//         <VideoElementContext.Provider value={{ videoElement, setVideoElement }}>
//             {children}
//         </VideoElementContext.Provider>
//     )
// };