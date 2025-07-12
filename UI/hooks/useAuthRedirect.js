import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export const useAuthRedirect = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const isLoggedIn = !!localStorage.getItem('userId');

        if (!isLoggedIn) {
            navigate('/login', {
                replace: true,
                state: { from: location.pathname },
            });
        }
    }, [navigate, location]);
};
