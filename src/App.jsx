import React, { useContext, useEffect, useState } from 'react'
import Sidebar from './components/Sidebar'
import Player from './components/player'
import Display from './components/Display'
import { playerContext } from './context/PlayerContext'
import { jwtDecode } from 'jwt-decode'
import Cookies from 'js-cookie'
import LogoutModal from './components/LogoutModel'

const App = () => {

  const [user, setUser] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const loadUser = () => {
    const accessToken = Cookies.get('accessToken');
    if (accessToken) {
      try {
        const decoded = jwtDecode(accessToken);
        setUser(decoded.UserInfo);
      } catch (err) {
        console.error('فشل في التحقق من الصلاحية');
        setUser(null);
      }
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const { audioRef, track } = useContext(playerContext);

  return (
    <div className='h-screen bg-gradient-to-br from-gray-800 via-gray-900  to-black'>
      <div className='h-[90%] flex overflow-hidden'>
        <Sidebar user={user} onLogoutClick={() => setShowLogoutModal(true)} />
        <Display user={user} setUser={setUser} />
      </div>
      <Player />
      <audio ref={audioRef} src={track?.audio?.secure_url} preload='auto'></audio>
      <LogoutModal
        show={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        setUser={setUser}
      />
    </div>
  )
}

export default App