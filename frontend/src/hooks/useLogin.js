import { useState } from 'react';
import { useAuthContext } from './useAuthContext';

export const useLogin = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(null);
    const { dispatch } = useAuthContext();

    // const checkUser  = (email) => {
    //     const studentRegex = /^\d{4}f-institutename-\d{4}$/;
    //     if (studentRegex.test(email)) {
    //         return 'student';
    //     }


    //     const teacherRegex = /^[a-zA-Z]+\.[a-zA-Z]+@example\.com$/;
    //     if (teacherRegex.test(email)) {
    //         return 'teacher';
    //     }


    //     const adminRegex = /^hello\.admin@example\.com$/;
    //     if (adminRegex.test(email)) {
    //         return 'admin';
    //     }

    //     return null;
    // };

    const login = async (email, password) => {
        setIsLoading(true);
        setError(null);

        // const userType = checkUser (email);
        // let apiEndpoint;


        // switch (userType) {
        //     case 'student':
        //         apiEndpoint = '/api/students/login';
        //         break;
        //     case 'teacher':
        //         apiEndpoint = '/api/teachers/login';
        //         break;
        //     case 'admin':
        //         apiEndpoint = '/api/admins/login';
        //         break;
        //     default:
        //         setIsLoading(false);
        //         setError('Invalid email format');
        //         return;
        // }

        const response = await fetch('/api/students/login', {
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