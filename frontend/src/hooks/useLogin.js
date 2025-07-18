import { useState } from 'react';
import { useAuthContext } from './useAuthContext';

export const useLogin = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { dispatch } = useAuthContext();
    
    const login = async (uid, password) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/user/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ uid, password })
            });

            const json = await response.json();

            if (!response.ok) {
                setError(json.error);
            } else {
                // Store token (remove JSON.stringify as it's already a string)
                localStorage.setItem('token', json.token);
                
                // Dispatch login action with user data
                dispatch({ type: 'LOGIN', payload: json.user });
            }
        } catch (error) {
            setError('Network error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return { login, isLoading, error };
};