import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
    const navigate = useNavigate();
    const token = localStorage.getItem('authToken');

    useEffect(() => {
        if (!token) {
            return navigate('/login');
        }
    }, [token, navigate]);


    return children;

}

export default ProtectedRoute
