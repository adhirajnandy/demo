import { createSlice } from "@reduxjs/toolkit";
import { updateCart } from "../utils/cartUtils";

const initialState = localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : {cartItems : [], shippingAddress: {}, paymentMethod: 'PayPal/'};


const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers:{
        addToCart: (state, action) => {
            const item = action.payload;
            // to check for existing items in the cart 
            const existItem = state.cartItems.find((x) => x._id === item._id);

            if(existItem){
                state.cartItems = state.cartItems.map((x) => x._id === existItem._id ? item : x);
            }
            else{
                state.cartItems = [...state.cartItems, item];
            }

            //calculate the item price
            return updateCart(state);
        },

        removeFromCart: (state,action) => {
            //Remove an item from state.cartItems based on action.payload (_id of the item)
            // filter method creates a new array passing the required criteria
            // finally the state of the cart items is update with the new filtered cartItems
            state.cartItems = state.cartItems.filter((x) => x._id !== action.payload);
            return updateCart(state);
        },

        saveShippingAddress : (state,action) => {
            state.shippingAddress = action.payload;
            return updateCart(state);
        }
    },
});

export const{addToCart} = cartSlice.actions;
export const{removeFromCart} = cartSlice.actions;
export const{saveShippingAddress} = cartSlice.actions;

export default cartSlice.reducer;