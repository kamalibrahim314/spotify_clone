import React, { useContext, useState, useEffect } from "react";
import { IoShuffleOutline, IoVolumeHighOutline } from "react-icons/io5";
import { ImPrevious2, ImNext2 } from "react-icons/im";
import { FaPause, FaPlay } from "react-icons/fa";
import { SlLoop } from "react-icons/sl";
import { AiOutlinePlaySquare } from "react-icons/ai";
import { GiMicrophone } from "react-icons/gi";
import { HiOutlineQueueList } from "react-icons/hi2";
import { MdOutlineZoomOutMap, MdSpeakerGroup } from "react-icons/md";
import { CgMiniPlayer } from "react-icons/cg";
import { playerContext } from "../context/PlayerContext";

const Player = () => {
    const { track, seekBG, seekBar, playStatus, play, pause, time, previous, next, seekSong, audioRef } = useContext(playerContext);
    console.log(track);

    // Load volume from localStorage or default to 0.7
    const [volume, setVolume] = useState(() => {
        const savedVolume = localStorage.getItem('player-volume');
        return savedVolume ? parseFloat(savedVolume) : 0.7;
    });

    // Update volume when it changes
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
        localStorage.setItem('player-volume', volume.toString());
    }, [volume, audioRef]);

    const handleVolumeChange = (e) => {
        const newVol = parseFloat(e.target.value);
        setVolume(newVol);
    };

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyPress = (e) => {
            if (e.code === 'Space' && !e.target.closest('input, textarea, button')) {
                e.preventDefault();
                playStatus ? pause() : play();
            }
        };

        document.addEventListener('keydown', handleKeyPress);
        return () => document.removeEventListener('keydown', handleKeyPress);
    }, [playStatus, play, pause]);

    if (!track) {
        return (
            <div className="h-20 bg-gradient-to-r from-gray-950 via-black to-gray-900 border-t border-gray-800 flex items-center justify-center text-gray-400">
                <p>Select a song to start playing</p>
            </div>
        );
    }

    return (
        <div className="h-20 bg-gradient-to-r from-gray-950 via-black to-gray-900 border-t border-gray-800 flex justify-between items-center text-white px-4">
            {/* Left: Track Info */}
            <div className="hidden lg:flex items-center gap-4 w-[25%]">
                <img
                    className="w-14 h-14 rounded shadow-lg object-cover"
                    src={track?.image?.secure_url || track?.image}
                    alt={track?.name}
                />
                <div className="min-w-0">
                    <p className="font-semibold text-sm truncate">{track?.name}</p>
                    <p className="text-xs text-gray-400 truncate">{track?.desc.split(" ").slice(0, 3).join(" ") || ""}</p>
                </div>
            </div>

            {/* Center: Controls */}
            <div className="flex flex-col items-center gap-2 w-full lg:w-[50%]">
                <div className="flex gap-5 items-center">
                    <IoShuffleOutline
                        className="cursor-pointer text-xl text-gray-400 hover:text-green-400 transition"
                        title="Shuffle"
                    />
                    <ImPrevious2
                        onClick={previous}
                        className="cursor-pointer text-xl text-gray-400 hover:text-white transition"
                        title="Previous"
                    />
                    {playStatus ? (
                        <FaPause
                            onClick={pause}
                            className="cursor-pointer text-xl transition-all duration-150"
                            title="Pause"
                        />
                    ) : (
                        <FaPlay
                            onClick={play}
                            className="cursor-pointer text-xl transition-all duration-150"
                            title="Play"
                        />
                    )}
                    <ImNext2
                        onClick={next}
                        className="cursor-pointer text-xl text-gray-400 hover:text-white transition"
                        title="Next"
                    />
                    <SlLoop
                        className="cursor-pointer text-xl text-gray-400 hover:text-green-400 transition"
                        title="Loop"
                    />
                </div>

                {/* Progress Bar */}
                <div className="flex items-center gap-3 w-full max-w-2xl">
                    <p className="text-xs text-gray-400 w-12 text-right">
                        {time.currentTime.minute}:{time.currentTime.second}
                    </p>
                    <div
                        ref={seekBG}
                        onClick={seekSong}
                        className="flex-1 h-1 bg-gray-600 rounded-full cursor-pointer relative group"
                    >
                        <div
                            ref={seekBar}
                            className="h-1 bg-green-500 rounded-full absolute top-0 left-0 w-0 transition-all duration-100"
                        ></div>
                        <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            style={{ left: `calc(${(seekBar.current?.style.width || '0%')} - 6px)` }}
                        ></div>
                    </div>
                    <p className="text-xs text-gray-400 w-12">
                        {time.totalTime.minute}:{time.totalTime.second}
                    </p>
                </div>
            </div>

            {/* Right: Extra Controls */}
            <div className="hidden lg:flex items-center gap-4 w-[25%] justify-end">
                <AiOutlinePlaySquare className="text-xl text-gray-400 hover:text-white transition cursor-pointer" title="Playlist" />
                <GiMicrophone className="text-xl text-gray-400 hover:text-white transition cursor-pointer" title="Lyrics" />
                <HiOutlineQueueList className="text-xl text-gray-400 hover:text-white transition cursor-pointer" title="Queue" />
                <MdSpeakerGroup className="text-xl text-gray-400 hover:text-white transition cursor-pointer" title="Connect to device" />
                <div className="flex items-center gap-2">
                    <IoVolumeHighOutline className="text-xl text-gray-400" />
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={volume}
                        onChange={handleVolumeChange}
                        className="w-24 accent-green-500 cursor-pointer"
                        title="Volume"
                    />
                </div>
                <CgMiniPlayer className="text-xl text-gray-400 hover:text-white transition cursor-pointer" title="Mini player" />
                <MdOutlineZoomOutMap className="text-xl text-gray-400 hover:text-white transition cursor-pointer" title="Full screen" />
            </div>
        </div>
    );
};

export default Player;