import { useAuthContext } from "./useAuthContext";
// import { useProductsContext } from './useProductsContext';

export const useLogout = () => {
    const { dispatch } = useAuthContext();
    // const { dispatch: userProductsDispatch } = useProductsContext();

    const logout = () => {
        localStorage.removeItem('token');

        dispatch({ type: 'LOGOUT' });
        // userProductsDispatch ({ type: 'SET_WORKOUTS', payload: null })
    }
    return { logout }
}