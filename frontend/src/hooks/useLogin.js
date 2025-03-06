import { useState } from 'react';
import { useAuthContext } from './useAuthContext';

export const useLogin = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(null);
    const { dispatch } = useAuthContext();
    let instname = process.env.REACT_APP_INST_NAME.toLowerCase()

    const checkUser  = (email) => {
        const studentRegex = new RegExp(`^\\d{4}([sf])-${instname}-\\d{4}$`);
        if (studentRegex.test(email)) {
            return 'student';
        }


        const teacherRegex = /^[a-zA-Z]+\.[a-zA-Z]$/;
        if (teacherRegex.test(email)) {
            return 'teacher';
        }


        const adminRegex = /^[a-zA-Z]+\.admin$/;
        if (adminRegex.test(email)) {
            return 'admin';
        }

        return null;
    };

    const login = async (email, password) => {
        setIsLoading(true);
        setError(null);

        const userType = checkUser (email);
        let apiEndpoint;


        switch (userType) {
            case 'student':
                apiEndpoint = '/api/students/login';
                break;
            case 'teacher':
                apiEndpoint = '/api/teachers/login';
                break;
            case 'admin':
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
            body: JSON.stringify({ email, password })
        });

        const json = await response.json();

        if (!response.ok) {
            setIsLoading(false);
            setError(json.error);
        } else {
            localStorage.setItem('token', JSON.stringify(json.token));
            const userResponse = await fetch(`/api/students/me`, {
                headers: { 'Authorization': `Bearer ${json.token}` }
            });

            const user = await userResponse.json();

            if (userResponse.ok) {
                dispatch({ type: 'LOGIN', payload: user });
            } else {
                setError(user.error);
            }

            setIsLoading(false);
        }
    };

    return { login, isLoading, error };
};