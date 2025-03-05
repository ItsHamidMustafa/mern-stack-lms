import { ProductsContext } from "../context/ProductsContext";
import { useContext } from "react";

export const useProductsContext = () => {
    const context = useContext(ProductsContext)

    if(!context) {
        throw Error('useWorkoutsContext must be used inside a WorkoutsContextProvider')
    }

    return context;
}