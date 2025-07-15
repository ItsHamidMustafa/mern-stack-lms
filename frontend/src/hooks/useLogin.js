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

        const response = await fetch('/api/user/login', {
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