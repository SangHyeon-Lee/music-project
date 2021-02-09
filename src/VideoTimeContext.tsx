import React, { useContext } from 'react'

const VideoTimeContext = React.createContext<VideoTimeContextType | undefined>(undefined);

type VideoTimeContextType = { 
    videoTime: number;
    setVideoTime: (value: number) => void;
};

export const useVideoTime = () => React.useContext(VideoTimeContext);

export const VideoTimeProvider = ({ children }: { children: React.ReactNode }) => {
    const [videoTime, setVideoTime] = React.useState(0);

    React.useEffect(() => {
        const currentTime = 0;
        setVideoTime(currentTime);
    }, []);

    return (
        <VideoTimeContext.Provider value={{ videoTime, setVideoTime }}>
            {children}
        </VideoTimeContext.Provider>
    )
};