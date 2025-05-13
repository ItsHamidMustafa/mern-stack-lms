import { createContext, useReducer, useEffect } from 'react';

export const AuthContext = createContext();

export const authReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN':
            return { user: action.payload, loading: false, error: null };
        case 'LOGOUT':
            return { user: null, loading: false, error: null };
        case 'SET_LOADING':
            return { ...state, loading: true };
        case 'SET_ERROR':
            return { user: null, loading: false, error: action.payload };
        default:
            return state;
    }
}

export const AuthContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, {
        user: null,
        loading: true, // Start with loading true
        error: null,
    });

    const fetchUser  = async (token) => {
        dispatch({ type: 'SET_LOADING' }); // Set loading to true

        try {
            const response = await fetch('/api/auth/me', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const user = await response.json();

            if (response.ok) {
                dispatch({ type: 'LOGIN', payload: user.user });
            } else {
                dispatch({ type: 'SET_ERROR', payload: user.error });
                console.error('Error fetching user: ', user.error);
            }

        } catch (error) {
            console.error("Network error: ", error);
            dispatch({ type: "LOGOUT" });
        }
    };

    useEffect(() => {
        const token = JSON.parse(localStorage.getItem('token'));
        if (token) {
            fetchUser (token);
        } else {
            dispatch({ type: 'LOGOUT' });
        }
    }, []);

    return (
        <AuthContext.Provider value={{ ...state, dispatch }}>
            {children}
        </AuthContext.Provider>
    )
}