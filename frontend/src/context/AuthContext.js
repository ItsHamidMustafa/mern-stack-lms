import React, { createContext, useReducer, useEffect } from 'react';

export const AuthContext = createContext();

export const authReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN':
            return {
                ...state,
                user: action.payload,
                loading: false,
                error: null
            };
        case 'LOGOUT':
            return {
                ...state,
                user: null,
                loading: false,
                error: null
            };
        case 'SET_LOADING':
            return {
                ...state,
                loading: true,
                error: null
            };
        case 'SET_ERROR':
            return {
                ...state,
                loading: false,
                error: action.payload
            };
        default:
            return state;
    }
};

export const AuthContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, {
        user: null,
        loading: true,
        error: null,
    });

    const fetchUser = async (token) => {
        dispatch({ type: 'SET_LOADING' });

        try {
            const response = await fetch('/api/user/me', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (response.ok) {
                dispatch({ type: 'LOGIN', payload: data.user });
            } else {
                dispatch({ type: 'SET_ERROR', payload: data.error });
                console.error('Error fetching user: ', data.error);
                // Remove invalid token
                localStorage.removeItem('token');
            }

        } catch (error) {
            console.error("Network error: ", error);
            dispatch({ type: "LOGOUT" });
            localStorage.removeItem('token');
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token'); // Remove JSON.parse
        if (token) {
            fetchUser(token);
        } else {
            dispatch({ type: 'LOGOUT' });
        }
    }, []);

    return (
        <AuthContext.Provider value={{ ...state, dispatch }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = () => {
    const context = React.useContext(AuthContext);
    if (!context) {
        throw Error('useAuthContext must be used inside an AuthContextProvider');
    }
    return context;
};