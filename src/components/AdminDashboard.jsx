// AdminDashboard.jsx
import { useState, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import {
    useAddAlbumMutation,
    useListAlbumsQuery,
    useRemoveAlbumMutation
} from "../redux/features/albums/albumApiSlice";
import {
    useAddSongMutation,
    useListSongsQuery,
    useRemoveSongMutation
} from "../redux/features/songs/songApiSlice";

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [showAddAlbumModal, setShowAddAlbumModal] = useState(false);
    const [showAddSongModal, setShowAddSongModal] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [notification, setNotification] = useState({ show: false, message: '', type: '' });

    const albumFormRef = useRef();
    const songFormRef = useRef();

    // Album Queries & Mutations
    const {
        data: albums,
        isLoading: albumsLoading,
        refetch: refetchAlbums,
        isError: albumsError
    } = useListAlbumsQuery();

    const [addAlbum, { isLoading: isAddingAlbum }] = useAddAlbumMutation();
    const [removeAlbum, { isLoading: isRemovingAlbum }] = useRemoveAlbumMutation();

    // Song Queries & Mutations
    const {
        data: songs,
        isLoading: songsLoading,
        refetch: refetchSongs,
        isError: songsError
    } = useListSongsQuery();

    const [addSong, { isLoading: isAddingSong }] = useAddSongMutation();
    const [removeSong, { isLoading: isRemovingSong }] = useRemoveSongMutation();

    // Show notification
    const showNotification = (message, type = 'success') => {
        setNotification({ show: true, message, type });
        setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
    };

    // Album Handlers
    const handleAddAlbum = async (e) => {
        e.preventDefault();
        const formData = new FormData(albumFormRef.current);

        try {
            await addAlbum(formData).unwrap();
            setShowAddAlbumModal(false);
            refetchAlbums();
            albumFormRef.current.reset();
            showNotification('Album added successfully!');
        } catch (error) {
            console.error('Failed to add album:', error);
            showNotification('Failed to add album', 'error');
        }
    };

    const handleDeleteAlbum = async (albumId) => {
        try {
            await removeAlbum(albumId).unwrap();
            refetchAlbums();
            setDeleteConfirm(null);
            showNotification('Album deleted successfully!');
        } catch (error) {
            console.error('Failed to delete album:', error);
            showNotification('Failed to delete album', 'error');
        }
    };

    // Song Handlers
    const handleAddSong = async (e) => {
        e.preventDefault();
        const formData = new FormData(songFormRef.current);

        try {
            await addSong(formData).unwrap();
            setShowAddSongModal(false);
            refetchSongs();
            songFormRef.current.reset();
            showNotification('Song added successfully!');
        } catch (error) {
            console.error('Failed to add song:', error);
            showNotification('Failed to add song', 'error');
        }
    };

    const handleDeleteSong = async (songId) => {
        try {
            await removeSong(songId).unwrap();
            refetchSongs();
            setDeleteConfirm(null);
            showNotification('Song deleted successfully!');
        } catch (error) {
            console.error('Failed to delete song:', error);
            showNotification('Failed to delete song', 'error');
        }
    };

    // Helper function to get album name from ID
    const getAlbumName = (albumId) => {
        return albums?.allAlbums?.find(album => album._id === albumId)?.name || 'Unknown Album';
    };

    // Stats Calculation
    const totalSongs = songs?.allSongs?.length || 0;
    const totalAlbums = albums?.allAlbums?.length || 0;
    const recentSongs = songs?.allSongs?.slice(0, 5) || [];
    const averageSongsPerAlbum = totalAlbums > 0 ? (totalSongs / totalAlbums).toFixed(1) : 0;

    if (albumsLoading || songsLoading) {
        return (
            <div className="flex min-h-screen bg-gray-900 text-white items-center justify-center">
                <div className="text-2xl">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            {/* Notification */}
            {notification.show && (
                <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${notification.type === 'error' ? 'bg-red-600' : 'bg-green-600'
                    }`}>
                    {notification.message}
                </div>
            )}

            {/* Top Navigation Bar */}
            <header className="bg-gray-800 p-4 sticky top-0 z-40 shadow-lg">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <h2 className="text-xl font-bold text-center md:text-left">🎛️ Admin Dashboard</h2>

                    <nav className="flex flex-wrap justify-center gap-2">
                        <button
                            onClick={() => setActiveTab('dashboard')}
                            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${activeTab === 'dashboard' ? 'bg-blue-600' : 'hover:bg-gray-700'
                                }`}
                        >
                            📊 Dashboard
                        </button>
                        <button
                            onClick={() => setActiveTab('songs')}
                            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${activeTab === 'songs' ? 'bg-blue-600' : 'hover:bg-gray-700'
                                }`}
                        >
                            🎵 Songs
                        </button>
                        <button
                            onClick={() => setActiveTab('albums')}
                            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${activeTab === 'albums' ? 'bg-blue-600' : 'hover:bg-gray-700'
                                }`}
                        >
                            📀 Albums
                        </button>
                        <button
                            onClick={() => navigate("/admin/users")}
                            className="px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-700"
                        >
                            👥 Users
                        </button>
                    </nav>
                </div>
            </header>

            {/* Main Content */}
            <main className="p-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
                    <h1 className="text-3xl font-bold">
                        {activeTab === 'dashboard' && 'Dashboard'}
                        {activeTab === 'songs' && 'Manage Songs'}
                        {activeTab === 'albums' && 'Manage Albums'}
                    </h1>

                    {activeTab === 'songs' && (
                        <button
                            onClick={() => setShowAddSongModal(true)}
                            className="bg-gradient-to-r from-green-500 to-teal-500 px-6 py-3 rounded-lg font-bold flex items-center gap-2 hover:scale-105 transition-transform w-full md:w-auto justify-center"
                        >
                            ➕ Add New Song
                        </button>
                    )}

                    {activeTab === 'albums' && (
                        <button
                            onClick={() => setShowAddAlbumModal(true)}
                            className="bg-gradient-to-r from-purple-500 to-indigo-500 px-6 py-3 rounded-lg font-bold flex items-center gap-2 hover:scale-105 transition-transform w-full md:w-auto justify-center"
                        >
                            📀 Add New Album
                        </button>
                    )}
                </div>

                {/* Dashboard Tab */}
                {activeTab === 'dashboard' && (
                    <div className="space-y-6">
                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-6 rounded-xl shadow-lg">
                                <div className="text-4xl font-bold">{totalSongs}</div>
                                <div className="text-blue-200">Total Songs</div>
                            </div>

                            <div className="bg-gradient-to-br from-purple-600 to-purple-800 p-6 rounded-xl shadow-lg">
                                <div className="text-4xl font-bold">{totalAlbums}</div>
                                <div className="text-purple-200">Total Albums</div>
                            </div>

                            <div className="bg-gradient-to-br from-green-600 to-green-800 p-6 rounded-xl shadow-lg">
                                <div className="text-4xl font-bold">{averageSongsPerAlbum}</div>
                                <div className="text-green-200">Avg Songs per Album</div>
                            </div>
                        </div>

                        {/* Recent Songs */}
                        <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
                            <h3 className="text-xl font-bold mb-4">Recently Added Songs</h3>
                            <div className="space-y-3">
                                {recentSongs.length > 0 ? (
                                    recentSongs.map(song => (
                                        <div key={song._id} className="flex justify-between items-center p-3 bg-gray-700 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <img src={song.image?.secure_url} alt={song.name} className="w-10 h-10 rounded" />
                                                <div>
                                                    <div className="font-medium">{song.name}</div>
                                                    <div className="text-sm text-gray-400">{song.duration}</div>
                                                </div>
                                            </div>
                                            <span className="text-green-400">Added</span>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-center py-4 text-gray-400">No songs added yet</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Songs Tab */}
                {activeTab === 'songs' && (
                    <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
                        <h2 className="text-xl font-bold mb-4">Songs List ({totalSongs})</h2>

                        {songs?.allSongs?.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {songs.allSongs.map(song => (
                                    <div key={song._id} className="bg-gray-700 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                                        <div className="relative">
                                            <img
                                                src={song.image?.secure_url}
                                                alt={song.name}
                                                className="w-full h-40 object-cover"
                                            />
                                            <div className="absolute top-2 right-2 bg-black bg-opacity-50 px-2 py-1 rounded text-sm">
                                                {song.duration}
                                            </div>
                                        </div>
                                        <div className="p-4">
                                            <h3 className="font-bold text-lg truncate">{song.name}</h3>
                                            <p className="text-gray-400 text-sm truncate">{song.desc}</p>
                                            <div className="flex justify-between items-center mt-3">
                                                <span className="text-xs bg-blue-600 px-2 py-1 rounded">
                                                    Album: {getAlbumName(song.album)}
                                                </span>
                                                <button
                                                    onClick={() => setDeleteConfirm({ type: 'song', id: song._id, name: song.name })}
                                                    className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm transition-colors"
                                                    disabled={isRemovingSong}
                                                >
                                                    {isRemovingSong ? 'Deleting...' : 'Delete'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <div className="text-6xl mb-4">🎵</div>
                                <p className="text-gray-400">No songs added yet</p>
                                <button
                                    onClick={() => setShowAddSongModal(true)}
                                    className="mt-4 bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
                                >
                                    Add First Song
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Albums Tab */}
                {activeTab === 'albums' && (
                    <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
                        <h2 className="text-xl font-bold mb-4">Albums List ({totalAlbums})</h2>

                        {albums?.allAlbums?.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {albums.allAlbums.map(album => (
                                    <div key={album._id} className="bg-gray-700 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                                        <div
                                            className="h-40 relative flex items-center justify-center"
                                            style={{ backgroundColor: album.bgColor || '#4F46E5' }}
                                        >
                                            <img
                                                src={album.image?.secure_url}
                                                alt={album.name}
                                                className="w-24 h-24 rounded-full object-cover border-4 border-white border-opacity-20"
                                            />
                                        </div>
                                        <div className="p-4">
                                            <h3 className="font-bold text-lg">{album.name}</h3>
                                            <p className="text-gray-400 text-sm mt-1">{album.desc}</p>
                                            <div className="flex justify-between items-center mt-3">
                                                <span className="text-xs bg-purple-600 px-2 py-1 rounded">Music Album</span>
                                                <button
                                                    onClick={() => setDeleteConfirm({ type: 'album', id: album._id, name: album.name })}
                                                    className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm transition-colors"
                                                    disabled={isRemovingAlbum}
                                                >
                                                    {isRemovingAlbum ? 'Deleting...' : 'Delete'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <div className="text-6xl mb-4">📀</div>
                                <p className="text-gray-400">No albums added yet</p>
                                <button
                                    onClick={() => setShowAddAlbumModal(true)}
                                    className="mt-4 bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded"
                                >
                                    Add First Album
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Add Album Modal */}
                {showAddAlbumModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-gray-800 rounded-xl w-full max-w-md p-6">
                            <h3 className="text-xl font-bold mb-4">Add New Album</h3>
                            <form ref={albumFormRef} onSubmit={handleAddAlbum}>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Album Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            required
                                            className="w-full bg-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Album Description</label>
                                        <textarea
                                            name="desc"
                                            rows="3"
                                            className="w-full bg-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        ></textarea>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Background Color</label>
                                        <input
                                            type="color"
                                            name="bgColor"
                                            defaultValue="#4F46E5"
                                            className="w-full h-10 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Album Image</label>
                                        <input
                                            type="file"
                                            name="image"
                                            accept="image/*"
                                            required
                                            className="w-full bg-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-3 mt-6">
                                    <button
                                        type="submit"
                                        disabled={isAddingAlbum}
                                        className="flex-1 bg-blue-600 hover:bg-blue-700 py-2 rounded-lg font-medium disabled:opacity-50"
                                    >
                                        {isAddingAlbum ? 'Adding...' : 'Add Album'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowAddAlbumModal(false)}
                                        className="flex-1 bg-gray-600 hover:bg-gray-700 py-2 rounded-lg font-medium"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Add Song Modal */}
                {showAddSongModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-gray-800 rounded-xl w-full max-w-md p-6">
                            <h3 className="text-xl font-bold mb-4">Add New Song</h3>
                            <form ref={songFormRef} onSubmit={handleAddSong} encType="multipart/form-data">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Song Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            required
                                            className="w-full bg-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Song Description</label>
                                        <textarea
                                            name="desc"
                                            rows="3"
                                            className="w-full bg-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        ></textarea>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Album</label>
                                        <select
                                            name="album"
                                            required
                                            className="w-full bg-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">Select Album</option>
                                            {albums?.allAlbums?.map(album => (
                                                <option key={album._id} value={album._id}>{album.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Song Image</label>
                                        <input
                                            type="file"
                                            name="image"
                                            accept="image/*"
                                            required
                                            className="w-full bg-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Audio File</label>
                                        <input
                                            type="file"
                                            name="audio"
                                            accept="audio/*"
                                            required
                                            className="w-full bg-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-3 mt-6">
                                    <button
                                        type="submit"
                                        disabled={isAddingSong}
                                        className="flex-1 bg-green-600 hover:bg-green-700 py-2 rounded-lg font-medium disabled:opacity-50"
                                    >
                                        {isAddingSong ? 'Adding...' : 'Add Song'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowAddSongModal(false)}
                                        className="flex-1 bg-gray-600 hover:bg-gray-700 py-2 rounded-lg font-medium"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Delete Confirmation Modal */}
                {deleteConfirm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-gray-800 rounded-xl w-full max-w-md p-6">
                            <h3 className="text-xl font-bold mb-2">Confirm Delete</h3>
                            <p className="mb-6">
                                Are you sure you want to delete this {deleteConfirm.type}?
                                <br />
                                <span className="font-bold">"{deleteConfirm.name}"</span>
                                <br />
                                <span className="text-red-400 text-sm">This action cannot be undone!</span>
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        if (deleteConfirm.type === 'song') {
                                            handleDeleteSong(deleteConfirm.id);
                                        } else {
                                            handleDeleteAlbum(deleteConfirm.id);
                                        }
                                    }}
                                    className="flex-1 bg-red-600 hover:bg-red-700 py-2 rounded-lg font-medium"
                                >
                                    Yes, Delete
                                </button>
                                <button
                                    onClick={() => setDeleteConfirm(null)}
                                    className="flex-1 bg-gray-600 hover:bg-gray-700 py-2 rounded-lg font-medium"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

export default AdminDashboard;