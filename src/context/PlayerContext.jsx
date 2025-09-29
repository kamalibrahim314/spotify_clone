import { createContext, useEffect, useRef, useState } from "react";
import { useListSongsQuery } from "../redux/features/songs/songApiSlice";

export const playerContext = createContext();

const PlayerContextProvider = (props) => {
    const audioRef = useRef();
    const seekBG = useRef();
    const seekBar = useRef();

    const { data, isLoading, isSuccess } = useListSongsQuery();

    const songs = data?.allSongs || [];
    const [track, setTrack] = useState(null);
    const [playStatus, setPlayStatus] = useState(false);
    const [time, setTime] = useState({
        currentTime: { second: "00", minute: 0 },
        totalTime: { second: "00", minute: 0 },
    });

    // ✅ Set first song when data loads
    useEffect(() => {
        if (isSuccess && songs.length > 0) {
            setTrack(songs[0]);
        }
    }, [isSuccess, songs]);

    const play = () => {
        if (audioRef.current) {
            audioRef.current.play();
            setPlayStatus(true);
        }
    };

    const pause = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            setPlayStatus(false);
        }
    };

    const playWithId = (id) => {
        const song = songs.find((s) => s._id === id);
        console.log(song);
        if (song) {
            setTrack(song);
            setTimeout(() => {
                if (audioRef.current) {
                    audioRef.current.play();
                    setPlayStatus(true);
                }
            }, 100);
        }
    };

    const previous = () => {
        if (!track) return;
        const currentIndex = songs.findIndex((s) => s._id === track._id);
        if (currentIndex > 0) {
            setTrack(songs[currentIndex - 1]);
            setTimeout(() => {
                if (audioRef.current) {
                    audioRef.current.play();
                    setPlayStatus(true);
                }
            }, 100);
        }
    };

    const next = () => {
        if (!track) return;
        const currentIndex = songs.findIndex((s) => s._id === track._id);
        if (currentIndex < songs.length - 1) {
            setTrack(songs[currentIndex + 1]);
            setTimeout(() => {
                if (audioRef.current) {
                    audioRef.current.play();
                    setPlayStatus(true);
                }
            }, 100);
        }
    };

    const seekSong = (e) => {
        if (!audioRef.current || !seekBG.current) return;

        const width = seekBG.current.clientWidth;
        const offset = e.nativeEvent.offsetX;
        const duration = audioRef.current.duration;

        if (duration && !isNaN(duration)) {
            audioRef.current.currentTime = (offset / width) * duration;
        }
    };

    const formatTime = (num) => String(Math.floor(num)).padStart(2, "0");

    // Audio event listeners
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const updateProgress = () => {
            if (audio.duration && !isNaN(audio.duration)) {
                const progressPercent = (audio.currentTime / audio.duration) * 100;
                if (seekBar.current) {
                    seekBar.current.style.width = `${progressPercent}%`;
                }

                setTime({
                    currentTime: {
                        second: formatTime(audio.currentTime % 60),
                        minute: Math.floor(audio.currentTime / 60),
                    },
                    totalTime: {
                        second: formatTime(audio.duration % 60),
                        minute: Math.floor(audio.duration / 60),
                    },
                });
            }
        };

        const handleLoadedMetadata = () => {
            if (audio.duration && !isNaN(audio.duration)) {
                setTime(prev => ({
                    ...prev,
                    totalTime: {
                        second: formatTime(audio.duration % 60),
                        minute: Math.floor(audio.duration / 60),
                    },
                }));
            }
        };

        const handleEnded = () => {
            next();
        };

        audio.addEventListener("timeupdate", updateProgress);
        audio.addEventListener("loadedmetadata", handleLoadedMetadata);
        audio.addEventListener("ended", handleEnded);

        return () => {
            audio.removeEventListener("timeupdate", updateProgress);
            audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
            audio.removeEventListener("ended", handleEnded);
        };
    }, [track]);

    const contextValue = {
        audioRef,
        seekBG,
        seekBar,
        songs,
        track,
        setTrack,
        playStatus,
        setPlayStatus,
        time,
        setTime,
        play,
        pause,
        playWithId,
        previous,
        next,
        seekSong,
    };

    return (
        <playerContext.Provider value={contextValue}>
            <audio
                ref={audioRef}
                src={track?.audio?.secure_url}
                preload="metadata"
            />
            {props.children}
        </playerContext.Provider>
    );
};

export default PlayerContextProvider;