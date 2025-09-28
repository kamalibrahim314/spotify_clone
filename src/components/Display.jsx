import React, { useEffect, useRef } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import DisplayHome from './DisplayHome'
import Album from './Album'
import { useListAlbumsQuery } from '../redux/features/albums/albumApiSlice'
import AdminDashboard from './AdminDashboard'
import { AdminRoute } from '../routes/ProtectedRoute'

const Display = ({ user, setUser }) => {
    const { data: albums } = useListAlbumsQuery();
    const displayRef = useRef();
    const location = useLocation();
    const albumId = location.pathname.includes('album') ? location.pathname.slice(-1) : null;
    const bgColor = albums?.allAlbums?.find(album => album._id === albumId)?.bgColor;

    useEffect(() => {
        if (location.pathname.includes('album')) {
            displayRef.current.style.background = `linear-gradient(180deg, ${bgColor} 0%, #121212 100%)`;
        } else {
            displayRef.current.style.background = 'linear-gradient(to bottom right, #111827, #000000, #111827)';
        }
    }, [location.pathname.includes('album'), bgColor, user]);

    return (
        <div ref={displayRef} className='w-[100%] rounded bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white overflow-auto lg:w[75%] lg:ml-0 border-amber-600'>
            <Routes>
                <Route path='/' element={<DisplayHome user={user} setUser={setUser} />} />
                <Route path='/album/:id' element={<Album user={user} setUser={setUser} />} />
                <Route path='/library' element={<div className='h-screen flex justify-center items-center text-2xl font-bold'>library page</div>} />
                <Route path='/podcasts' element={<div className='h-screen flex justify-center items-center text-2xl font-bold'>podcasts page</div>} />
                <Route path='/dashboard' element={<AdminRoute><AdminDashboard user={user} setUser={setUser} /></AdminRoute>} />
                <Route path='/admin/users' element={<AdminRoute><div className='h-screen flex justify-center items-center text-2xl font-bold'>users page</div></AdminRoute>} />
                <Route path='*' element={<div className='h-screen flex justify-center items-center text-2xl font-bold'>404 Page Not Found</div>} />
            </Routes>
        </div>
    )
}

export default Display