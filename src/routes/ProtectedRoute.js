import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie'
import { jwtDecode } from 'jwt-decode';


const getUserRole = () => {
    const token = Cookies.get('accessToken');
    if (!token) return null;

    try {
        const decoded = jwtDecode(token);
        return decoded?.UserInfo?.role || null;
    } catch (err) {
        return null;
    }
};

export const AdminRoute = ({ children }) => {
    const navigate = useNavigate();

    const role = getUserRole();
    if (role !== "admin") {
        return navigate('/');
    }
    return children;
};


