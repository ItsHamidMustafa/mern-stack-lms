import { createContext, useReducer } from "react";

export const ProductsContext = createContext()

export const productsReducer = (state, action) => {
  switch (action.type) {
    case 'SET_PRODUCTS':
      return {
        products: action.payload
      }
    case 'CREATE_PRODUCT':
      return {
        products: [action.payload, ...state.products]
      }
    case 'DELETE_PRODUCT':
      return {
        products: state.products.filter((w) => w._id !== action.payload._id)
      }
    case 'EDIT_PRODUCT':
      state.products.reduce((acc, products) => {
        if (products._id === action.payload._id) {
          acc.push(action.payload)
          return acc;
        } else {
          acc.push(products);
          return acc;
        }
      }, [])
      return {
        products: state.products.reduce((acc, product) => {
          if (product._id === action.payload._id) {
            acc.push(action.payload);
          } else {
            acc.push(product);
          }
          return acc;
        }, [])
      }

    default:
      return state;
  }
}

export const ProductsContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(productsReducer, {
    products: null
  });

  return (
    <ProductsContext.Provider value={{ ...state, dispatch }}>
      {children}
    </ProductsContext.Provider>
  );
};