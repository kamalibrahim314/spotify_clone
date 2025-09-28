import React, { useContext, useState } from 'react'
import { playerContext } from '../context/PlayerContext';

const SongItems = ({ song, albums }) => {
    console.log(song);
    const { playWithId } = useContext(playerContext);
    const [isPlaying, setIsPlaying] = useState(false);

    const getAlbumName = (albumId) => {
        return albums?.find(album => album._id === albumId)?.name || 'Unknown Album';
    };

    return (
        <div
            onClick={() => {
                playWithId(song._id);
                setIsPlaying(true);
                setTimeout(() => setIsPlaying(false), 2000);
            }}
            className="min-w-[180px] group cursor-pointer transition-all duration-300 hover:scale-105"
        >
            <div className="relative overflow-hidden rounded-xl mb-3 shadow-2xl">
                <img
                    src={song.image?.secure_url}
                    alt={song.name}
                    className="w-full h-32 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className={`rounded-full p-3 transform scale-75 group-hover:scale-100 transition-all duration-300 ${isPlaying ? 'bg-green-500' : 'bg-blue-600/90'
                        }`}>
                        {isPlaying ? (
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M6 4h4v16H6zm8 0h4v16h-4z" />
                            </svg>
                        ) : (
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                        )}
                    </div>
                </div>
                <div className="absolute top-2 right-2 bg-black/50 rounded-full px-2 py-1 text-xs">
                    {song.duration}
                </div>
            </div>
            <p className="font-bold text-white truncate">{song.name}</p>
            <p className="text-gray-400 text-sm truncate">{getAlbumName(song.album)}</p>
        </div>
    )
}


export default SongItems