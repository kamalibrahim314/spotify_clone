// DisplayHome.jsx
import React, { useEffect, useState } from 'react'

import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

// Import your API hooks
import { useListAlbumsQuery } from "../redux/features/albums/albumApiSlice"
import { useListSongsQuery } from "../redux/features/songs/songApiSlice"

import Navbar from './Navbar'
import AuthModal from "./AuthModal"
import LogoutModal from './LogoutModel'
import AlbumItems from './AlbumItems'
import SongItems from './SongItems'


// Loading skeleton components


const SongSkeleton = () => (
    <div className="min-w-[180px] p-4 rounded-lg bg-gradient-to-br from-gray-800 to-gray-900 animate-pulse">
        <div className="w-full h-32 bg-gray-700 rounded-lg mb-3"></div>
        <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-700 rounded w-full"></div>
    </div>
)

const AlbumSkeleton = () => (
    <div className="min-w-[200px] p-4 rounded-lg bg-gradient-to-br from-gray-800 to-gray-900 animate-pulse">
        <div className="w-full h-40 bg-gray-700 rounded-lg mb-3"></div>
        <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-700 rounded w-full"></div>
    </div>
)


const DisplayHome = ({ user, setUser }) => {
    const [showAuth, setShowAuth] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    // pagination states
    const [albumPage, setAlbumPage] = useState(0);
    const [songPage, setSongPage] = useState(0);
    const [viewAllSongs, setViewAllSongs] = useState(false);

    const { data: albumsData, isLoading: albumsLoading, error: albumsError, refetch: refetchAlbums } = useListAlbumsQuery();
    const { data: songsData, isLoading: songsLoading, error: songsError, refetch: refetchSongs } = useListSongsQuery();

    const albumsPerPage = 6;
    const songsPerPage = 8;

    const featuredAlbums = albumsData?.allAlbums?.slice(albumPage * albumsPerPage, (albumPage + 1) * albumsPerPage) || [];
    const trendingSongs = viewAllSongs
        ? songsData?.allSongs || []
        : songsData?.allSongs?.slice(songPage * songsPerPage, (songPage + 1) * songsPerPage) || [];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
            <Navbar user={user} onLoginClick={() => setShowAuth(true)} onLogoutClick={() => setShowLogoutModal(true)} />
            <AuthModal show={showAuth} onClose={() => setShowAuth(false)} setUser={setUser} />
            <LogoutModal show={showLogoutModal} onClose={() => setShowLogoutModal(false)} setUser={setUser} />

            {/* Hero Section */}
            <div className="relative h-96 overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage: 'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.8)), url(https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80)'
                    }}
                />
                <div className="relative z-10 h-full flex items-center justify-center text-center px-4">
                    <div className="max-w-4xl">
                        <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-400 bg-clip-text text-transparent">
                            Stream Your Passion
                        </h1>
                        <p className="text-xl text-gray-300 mb-8">
                            Discover millions of songs, albums, and playlists. Experience music like never before.
                        </p>
                        <button
                            onClick={() => document.getElementById('trending').scrollIntoView({ behavior: 'smooth' })}
                            className="bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-3 rounded-full font-bold hover:scale-105 transition-transform duration-300 shadow-2xl"
                        >
                            Explore Trending
                        </button>
                    </div>
                </div>
            </div>

            {/* Featured Charts Section */}
            <div className="px-6 py-12 max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                            Featured Charts
                        </h2>
                        <p className="text-gray-400 mt-2">Top albums making waves this week</p>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => setAlbumPage(Math.max(albumPage - 1, 0))} className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors">
                            <IoIosArrowBack />
                        </button>
                        <button onClick={() => setAlbumPage(albumPage + 1)} className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors">
                            <IoIosArrowForward />
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-6 overflow-x-auto pb-6 scrollbar-hide">
                    {albumsLoading ? (
                        Array.from({ length: 6 }).map((_, index) => <AlbumSkeleton key={index} />)
                    ) : featuredAlbums.length > 0 ? (
                        featuredAlbums.map((album) => (
                            <AlbumItems key={album._id} album={album} />
                        ))
                    ) : (
                        <div className="text-center w-full py-12">
                            <div className="text-6xl mb-4">🎵</div>
                            <p className="text-gray-400 text-xl">No albums available yet</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Today's Biggest Hits Section */}
            <div id="trending" className="px-6 py-12 max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                            Today's Biggest Hits
                        </h2>
                        <p className="text-gray-400 mt-2">Trending songs you don't want to miss</p>
                    </div>
                    <button onClick={() => setViewAllSongs(!viewAllSongs)} className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors">
                        <span>{viewAllSongs ? "Show Less" : "View All"}</span>
                        <IoIosArrowForward />
                    </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-6">
                    {songsLoading ? (
                        Array.from({ length: 8 }).map((_, index) => <SongSkeleton key={index} />)
                    ) : trendingSongs.length > 0 ? (
                        trendingSongs.map((song) => (
                            <SongItems key={song._id} song={song} albums={albumsData?.allAlbums} />
                        ))
                    ) : (
                        <div className="col-span-full text-center py-12">
                            <div className="text-6xl mb-4">🎶</div>
                            <p className="text-gray-400 text-xl">No songs available yet</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Stats Section */}
            <div className="px-6 py-12 bg-gradient-to-r from-gray-900 to-black border-t border-gray-800">
                <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    <div>
                        <div className="text-3xl font-bold text-blue-400">{albumsData?.allAlbums?.length || 0}</div>
                        <div className="text-gray-400">Albums</div>
                    </div>
                    <div>
                        <div className="text-3xl font-bold text-purple-400">{songsData?.allSongs?.length || 0}</div>
                        <div className="text-gray-400">Songs</div>
                    </div>
                    <div>
                        <div className="text-3xl font-bold text-pink-400">24/7</div>
                        <div className="text-gray-400">Streaming</div>
                    </div>
                    <div>
                        <div className="text-3xl font-bold text-green-400">100%</div>
                        <div className="text-gray-400">Quality</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DisplayHome