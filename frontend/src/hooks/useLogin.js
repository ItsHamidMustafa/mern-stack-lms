import { useState } from 'react';
import { useAuthContext } from './useAuthContext';

export const useLogin = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(null);
    const { dispatch } = useAuthContext();
    let instname = process.env.REACT_APP_INST_NAME.toLowerCase()

    const checkUser = (uid) => {
        const studentRegex = new RegExp(`^\\d{4}([sf])-${instname}-\\d{4}$`);
        if (studentRegex.test(uid)) {
            return 'student';
        }

        const adminRegex = /^[a-zA-Z]+\.admin$/;
        if (adminRegex.test(uid)) {
            return 'admin';
        }

        const teacherRegex = /^[a-zA-Z]+\.[a-zA-Z]+$/;
        if (teacherRegex.test(uid)) {
            return 'teacher';
        }

        return null;
    };

    const login = async (uid, password) => {
        setIsLoading(true);
        setError(null);

        const userType = checkUser(uid);
        let apiEndpoint;


        switch (userType) {
            case 'student':
                apiEndpoint = '/api/students/login';
                break;
            case 'teacher':
                apiEndpoint = '/api/teachers/login';
                break;
            case 'admin':
                console.log('case admin true');
                apiEndpoint = '/api/admins/login';
                break;
            default:
                setIsLoading(false);
                setError('Invalid email format');
                return;
        }
        const response = await fetch(apiEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ uid, password })
        });

        const json = await response.json();

        if (!response.ok) {
            setIsLoading(false);
            setError(json.error);
        } else {
            localStorage.setItem('token', JSON.stringify(json.token));
            dispatch({ type: 'LOGIN', payload: json });
            setIsLoading(false);
        }
    };

    return { login, isLoading, error };
};