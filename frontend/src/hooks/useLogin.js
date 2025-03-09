import { useState } from 'react';
import { useAuthContext } from './useAuthContext';

export const useLogin = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(null);
    const { dispatch } = useAuthContext();
    let instname = process.env.REACT_APP_INST_NAME.toLowerCase()

    const checkUser = (regno) => {
        const studentRegex = new RegExp(`^\\d{4}([sf])-${instname}-\\d{4}$`);
        if (studentRegex.test(regno)) {
            console.log('is student [true]')
            return 'student';
        }

        const adminRegex = /^[a-zA-Z]+\.admin$/;
        if (adminRegex.test(regno)) {
            console.log('is admin [true]')
            return 'admin';
        }

        const teacherRegex = /^[a-zA-Z]+\.[a-zA-Z]+$/;
        if (teacherRegex.test(regno)) {
            console.log('is teacher [true]')
            return 'teacher';
        }

        return null;
    };

    const login = async (regno, password) => {
        setIsLoading(true);
        setError(null);

        const userType = checkUser(regno);
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
            body: JSON.stringify({ regno, password })
        });

        const json = await response.json();

        if (!response.ok) {
            setIsLoading(false);
            setError(json.error);
        } else {
            localStorage.setItem('token', JSON.stringify(json.token));
            dispatch ({ type: 'LOGIN', payload: { user: json }});
            setIsLoading(false);
        }
    };

    return { login, isLoading, error };
};