import React, { useState, useEffect } from 'react'
import { assets } from '../assets/frontend-assets/assets'
import { IoHomeOutline, IoSettingsOutline, IoLogOutOutline } from 'react-icons/io5'
import { CiSearch } from 'react-icons/ci'
import { LuLibraryBig, LuUserCog } from 'react-icons/lu'
import { MdDashboard, MdAdminPanelSettings } from 'react-icons/md'
import { useNavigate, useLocation } from 'react-router-dom'
const Sidebar = ({ user, onLogoutClick }) => {
    const navigate = useNavigate();
    const location = useLocation();

    // 🔍 search state
    const [isSearching, setIsSearching] = useState(false);
    const [query, setQuery] = useState("");

    const quickActions = [
        { title: 'Create your first playlist', description: "It's easy, we'll help you", buttonText: 'Create playlist', onClick: () => navigate('/playlist') },
        { title: "Let's find some podcasts", description: "We'll keep you updated on new episodes", buttonText: 'Browse podcasts', onClick: () => navigate('/podcasts') }
    ];

    const handleSearch = (e) => {
        e.preventDefault();
        if (query.trim()) {
            console.log("Searching for:", query);
            // هنا ممكن تعمل navigate(`/search?query=${query}`) أو API call
            navigate(`/search?query=${query}`);
        }
    };

    return (
        <div className={`w-64 h-full flex-col gap-2 text-white hidden lg:flex transition-all duration-300 overflow-auto`}>
            <div className='bg-gray-800 flex-1 flex flex-col'>
                <div className='p-2 space-y-2'>
                    <div onClick={() => navigate('/')} className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 group ${location.pathname === '/' ? 'bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg' : 'hover:bg-gray-700 hover:scale-105'}`}>
                        <IoHomeOutline className={`text-xl ${location.pathname === '/' ? 'text-white' : 'text-gray-300 group-hover:text-white'}`} />
                        <span className='font-semibold'>Home</span>
                    </div>

                    {!isSearching ? (
                        <div
                            onClick={() => setIsSearching(true)}
                            className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 group hover:bg-gray-700 hover:scale-105`}
                        >
                            <CiSearch className={`text-xl text-gray-300 group-hover:text-white`} />
                            <span className='font-semibold'>Search</span>
                        </div>
                    ) : (
                        <form onSubmit={handleSearch} className="flex items-center gap-2 p-2 bg-gray-700 rounded-lg">
                            <CiSearch className="text-xl text-gray-300" />
                            <input
                                type="text"
                                placeholder="Type to search..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                className="bg-transparent outline-none text-white flex-1"
                                autoFocus
                                onBlur={() => !query && setIsSearching(false)}
                            />
                        </form>
                    )}

                    <div onClick={() => navigate('/library')} className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 group ${location.pathname === '/library' ? 'bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg' : 'hover:bg-gray-700 hover:scale-105'}`}>
                        <LuLibraryBig className={`text-xl ${location.pathname === '/library' ? 'text-white' : 'text-gray-300 group-hover:text-white'}`} />
                        <span className='font-semibold'>Your Library</span>
                    </div>

                    {user?.role === 'admin' && (
                        <div onClick={() => navigate('/dashboard')} className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 group mb-2 ${location.pathname === '/dashboard' ? 'bg-gradient-to-r from-yellow-600 to-orange-600 shadow-lg' : 'hover:bg-yellow-500/20 hover:scale-105'}`}>
                            <MdDashboard className={`text-xl ${location.pathname === '/dashboard' ? 'text-white' : 'text-yellow-400 group-hover:text-white'}`} />
                            <span className='font-semibold'>Dashboard</span>
                        </div>
                    )}
                </div>

                <div className='p-4 space-y-4'>
                    {quickActions.map((action, index) => (
                        <div key={index} className='bg-gradient-to-br from-gray-700 to-gray-800 p-4 rounded-lg'>
                            <h3 className='font-semibold text-sm mb-1'>{action.title}</h3>
                            <p className='text-xs text-gray-400 mb-3'>{action.description}</p>
                            <button
                                onClick={action.onClick}
                                className='bg-white text-black text-xs py-2 px-4 rounded-full font-bold hover:scale-105 transition-transform'
                            >
                                {action.buttonText}
                            </button>
                        </div>
                    ))}
                </div>

                {user && (
                    <div className='mt-auto p-4 border-t border-gray-700'>
                        <div className={`flex items-center gap-3 p-2 rounded-lg bg-gray-700/50 justify-between`}>
                            <div className='flex items-center gap-3'>
                                <div>
                                    <p className='font-semibold text-sm'>{user.name}</p>
                                    <p className='text-xs text-gray-400'>{user?.role === 'admin' ? 'Administrator' : 'User'}</p>
                                </div>
                            </div>
                            <div className='flex gap-2'>
                                <IoSettingsOutline
                                    className='text-gray-400 hover:text-white cursor-pointer'
                                    onClick={() => navigate('/settings')}
                                />
                                <IoLogOutOutline
                                    className='text-gray-400 hover:text-red-400 cursor-pointer'
                                    onClick={onLogoutClick}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Sidebar
