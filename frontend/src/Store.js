import { createContext, useReducer } from 'react';

export const Store = createContext();

/**
 * initialState carries state for users and carts
 */
const initialState = {
  cart: {
    cartItems: localStorage.getItem('cartItems')
      ? JSON.parse(localStorage.getItem('cartItems'))
      : [],
  },

  userInfo: localStorage.getItem('userInfo')
  ? localStorage.getItem('userInfo')
  : null,
};

/**
 * reducer function to update state
 * @date 2023-03-21
 * @param {any} state
 * @param {any} action
 * @returns {any}
 */
function reducer(state, action) {
  switch (action.type) {
    case 'CART_ADD_ITEM':
      // add to cart
      const newItem = action.payload;
      const existItem = state.cart.cartItems.find(
        (item) => item.id === newItem.id
      );

      // If item exists, check to see if same item can be updated, else add new item
      const cartItems = existItem
        ? state.cart.cartItems.map((item) =>
            item.id === existItem.id ? newItem : item
          )
        : [...state.cart.cartItems, newItem];
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
      return { ...state, cart: { ...state.cart, cartItems } };
    case 'CART_REMOVE_ITEM': {
      //find the item to remove then update state to remove item
      const cartItems = state.cart.cartItems.filter(
        (item) => item.id !== action.payload.id
      );
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      return { ...state, cart: { ...state.cart, cartItems } };
    }
    case 'CART_REMOVE_ALL': {
      // Just clear cart state 
      const cartItems = []
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      return { ...state, cart: { ...state.cart, cartItems } };
    }
    case 'USER_SIGNIN':
      return { ...state, userInfo: action.payload };
    case 'USER_SIGNOUT':
      return {
        ...state,
        userInfo: null,
      };
    default:
      return state;
  }
}

export function StoreProvider(props) {
  //Typical React reducer behaviour, we have a state, a dispatch function 
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  // This provides the store to entire app
  return <Store.Provider value={value}>{props.children} </Store.Provider>;
}