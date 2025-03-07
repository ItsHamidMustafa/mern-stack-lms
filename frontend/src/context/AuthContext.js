import { createContext, useReducer, useEffect } from 'react';

export const AuthContext = createContext();

export const authReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN':
            return { student: action.payload }
        case 'LOGOUT':
            return { student: null };
        default:
            return state;
    }
}

export const AuthContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, {
        student: null
    });

    const fetchStudent = async (token) => {
        const response = await fetch('/api/students/me', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const student = await response.json();

        if (response.ok) {
            dispatch({ type: 'LOGIN', payload: student });
        } else {
            console.error('Error fetching student: ', student.error);
        }
    };

    useEffect(() => {
        const token = JSON.parse(localStorage.getItem('token'));
        const role = JSON.parse(localStorage.getItem('role'));
        if (token) {
            fetchStudent(token);
        }
    }, []);

    return (
        <AuthContext.Provider value={{ ...state, dispatch }}>
            {children}
        </AuthContext.Provider>
    )
}
