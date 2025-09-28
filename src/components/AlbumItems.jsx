import React from 'react'
import { useNavigate } from 'react-router-dom';


const AlbumItems = ({ album }) => {
    const navigate = useNavigate();

    return (
        <div
            onClick={() => navigate(`/album/${album._id}`)}
            className="min-w-[200px] group cursor-pointer transition-all duration-300 hover:scale-105"
        >
            <div className="relative overflow-hidden rounded-xl mb-3 shadow-2xl">
                <img
                    src={album.image?.secure_url || album.image}
                    alt={album.name}
                    className="w-full h-40 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                    <div className="bg-blue-600/90 rounded-full p-2 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                        </svg>
                    </div>
                </div>
            </div>
            <p className="font-bold text-white truncate">{album.name}</p>
            <p className="text-gray-400 text-sm truncate">{album.desc}</p>
        </div>
    )
}

export default AlbumItems