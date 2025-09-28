import React from 'react'
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md'
import { useNavigate } from 'react-router-dom';

const Navbar = ({ user, onLoginClick, onLogoutClick }) => {
    const navigate = useNavigate();

    return (
        <>
            <div className='w-full px-4 py-3 flex justify-between items-center font-semibold'>
                <div className='flex items-center gap-2'>
                    <MdKeyboardArrowLeft onClick={() => navigate(-1)} className='text-4xl b bg-black p-1 rounded-2xl cursor-pointer' />
                    <MdKeyboardArrowRight onClick={() => navigate(1)} className='text-4xl b bg-black p-1 rounded-2xl cursor-pointer' />
                </div>
                <div className='flex items-center gap-4'>
                    <p className='bg-white text-black text-[15px] px-4 py-1 rounded-2xl hidden md:block font-bold hover:cursor-pointer'>Explore Premium</p>
                    <p className='bg-black text-[15px] px-3 py-1 rounded-2xl hover:cursor-pointer'>Install App</p>
                    {user
                        ? (
                            <>
                                <p className='bg-purple-500 font-bold text-black w-7 h-7 rounded-full flex items-center justify-center hover:cursor-pointer'>{user?.name.charAt(0)}</p>
                                <p onClick={onLogoutClick} className='bg-red-500 text-[15px] px-3 py-1 rounded-2xl hover:cursor-pointer'>log out</p>
                            </>
                        )
                        : <p onClick={onLoginClick} className='bg-black text-[15px] px-3 py-1 rounded-2xl hover:cursor-pointer'>Log in</p>
                    }
                </div>
            </div>
        </>
    )
}

export default Navbar