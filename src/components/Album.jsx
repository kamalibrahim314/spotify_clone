import React, { useContext, useState, useMemo } from 'react'
import Navbar from './Navbar'
import { assets } from '../assets/frontend-assets/assets'
import { useParams } from 'react-router-dom';
import { FaRegClock } from 'react-icons/fa';
import { playerContext } from '../context/PlayerContext';
import { useAlbumSongsQuery } from '../redux/features/songs/songApiSlice'
import { useAlbumQuery } from '../redux/features/albums/albumApiSlice'
import AuthModal from './AuthModal';
import LogoutModal from './LogoutModel';

const Album = ({ user, setUser }) => {
    const [showAuth, setShowAuth] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const { id } = useParams();
    const { playWithId } = useContext(playerContext);

    const { data: albumData, isLoading, isError, error } = useAlbumSongsQuery(id);
    const { data: album } = useAlbumQuery(id);

    // Memoize calculated total duration
    const totalDuration = useMemo(() => {
        if (!albumData?.albumSongs?.length) return "0 min";

        const totalSeconds = albumData.albumSongs
            .map((song) => {
                const [m, s] = song.duration.split(":").map(Number);
                return m * 60 + s;
            })
            .reduce((a, b) => a + b, 0);

        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);

        return hours > 0
            ? `${hours} hr ${minutes} min`
            : `${minutes} min`;
    }, [albumData?.albumSongs]);

    // Format time ago function
    const formatTimeAgo = (dateString) => {
        const d = Math.floor((Date.now() - new Date(dateString)) / 1000);
        const m = Math.floor(d / 60),
            h = Math.floor(m / 60),
            day = Math.floor(h / 24),
            w = Math.floor(day / 7),
            mo = Math.floor(day / 30),
            y = Math.floor(day / 365);

        if (d < 60) return "just now";
        if (m < 60) return `${m} min ago`;
        if (h < 24) return `${h} hr ago`;
        if (day < 7) return `${day} day${day > 1 ? "s" : ""} ago`;
        if (w < 5) return `${w} week${w > 1 ? "s" : ""} ago`;
        if (mo < 12) return `${mo} month${mo > 1 ? "s" : ""} ago`;
        return `${y} year${y > 1 ? "s" : ""} ago`;
    };

    if (isLoading) return (
        <div className="flex items-center justify-center h-screen text-gray-400">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        </div>
    );

    if (isError) return (
        <div className="flex items-center justify-center h-screen text-red-500">
            Error: {error?.data?.message || "Failed to load album"}
        </div>
    );

    return (
        <div className='px-4 min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900'>
            <Navbar user={user} onLoginClick={() => setShowAuth(true)} onLogoutClick={() => setShowLogoutModal(true)} />
            <AuthModal
                show={showAuth}
                onClose={() => setShowAuth(false)}
                setUser={setUser}
            />
            <LogoutModal
                show={showLogoutModal}
                onClose={() => setShowLogoutModal(false)}
                setUser={setUser}
            />

            <div className='mt-10 flex gap-8 flex-col md:flex-row md:items-center'>
                <img
                    src={album?.album?.image?.secure_url}
                    alt={album?.album?.name}
                    className='w-48 h-48 rounded-lg shadow-2xl object-cover'
                />
                <div className='flex flex-col text-white'>
                    <p className='text-gray-400 uppercase text-sm font-semibold'>Playlist</p>
                    <h2 className='text-5xl font-bold mb-4 md:text-7xl'>{album?.album?.name}</h2>
                    <p className='text-gray-300 mb-4'>{album?.album?.desc}</p>
                    <p className='mt-1 flex items-center gap-3 text-gray-400'>
                        <img className='inline-block w-5' src={assets.spotify_logo} alt="spotify" />
                        <b>Spotify</b>
                        .<b>{albumData?.albumSongs?.length || 0} songs</b>
                        . {totalDuration}
                    </p>
                </div>
            </div>

            {/* Songs List */}
            <div className='mt-12'>
                <div className='grid grid-cols-3 sm:grid-cols-4 mt-10 mb-4 pl-2 text-[#a7a7a7]'>
                    <p><b className='mr-4'>#</b>TITLE</p>
                    <p>Album</p>
                    <p className='hidden sm:block'>Date Added</p>
                    <FaRegClock className='m-auto' />
                </div>
                <hr className='border-gray-700' />

                {albumData?.albumSongs?.length > 0 ? (
                    albumData.albumSongs.map((song, index) => (
                        <div
                            onClick={() => playWithId(song._id)}
                            key={song._id}
                            className='grid grid-cols-3 sm:grid-cols-4 gap-2 p-3 items-center text-[#a7a7a7] hover:bg-[#ffffff26] cursor-pointer rounded-lg transition-colors'
                        >
                            <div className='text-white flex items-center'>
                                <b className='mr-4 text-[#a7a7a7] w-6'>{index + 1}</b>
                                <img
                                    className='w-10 h-10 mr-4 inline rounded'
                                    src={song?.image?.secure_url}
                                    alt={song.name}
                                />
                                <div className='truncate'>
                                    <p className='font-medium truncate'>{song?.name}</p>
                                    <p className='text-sm text-gray-400'>{song?.artist || 'Unknown Artist'}</p>
                                </div>
                            </div>
                            <p className='text-[15px] truncate'>{song?.album?.name}</p>
                            <p className='text-[15px] hidden sm:block'>
                                {formatTimeAgo(song.createdAt)}
                            </p>
                            <p className='m-auto'>{song.duration}</p>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4 text-gray-600">🎵</div>
                        <p className="text-gray-400 text-xl">No songs in this album</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Album;