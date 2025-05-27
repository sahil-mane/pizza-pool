"use client";
import { SessionProvider } from "next-auth/react";
import { createContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

export const CartContext = createContext({});

export function cartProductPrice(cartProduct) {
  let price = cartProduct.basePrice;
  if (cartProduct.size) {
    price += cartProduct.size.price;
  }
  if (cartProduct.extras?.length > 0) {
    for (const extra of cartProduct.extras) {
      price += extra.price;
    }
  }
  return price;
}

export function AppProvider({ children }) {
    const [cartProducts,setCartProducts] = useState([]);

    const ls = typeof window !== 'undefined' ? window.localStorage : null;

    useEffect(()=>{
        if(ls && ls.getItem('cart')) {
            setCartProducts(JSON.parse(ls.getItem('cart')));
        }
    },[]);

    function clearCart() {
        setCartProducts([]);
        saveCartProductToLocalStroge([]);
    }

    function removeCartProduct(indexToRemove) {
        setCartProducts(prevCartProducts => {
            const newCartProducts = prevCartProducts
            .filter((product, index) => index !== indexToRemove);
            saveCartProductToLocalStroge(newCartProducts);
            return newCartProducts;
        });
        toast.success('Product removed');
    }

    function saveCartProductToLocalStroge(cartProducts) {
        if(ls){
            ls.setItem('cart',JSON.stringify(cartProducts));
        }
    }

    function addToCart(product,size=null,extras=[]){
        setCartProducts(prevProducts => {
            const cartProduct = {...product,size,extras};
            const newProducts = [...prevProducts, cartProduct];
            saveCartProductToLocalStroge(newProducts);
            console.log("context_data",newProducts);
            return newProducts;
        })
    }

    const [viewMessagefalse, setViewMessagefalse] = useState(null);

  return (
    <SessionProvider>
      <CartContext.Provider value={{
        cartProducts, setCartProducts,addToCart,removeCartProduct,clearCart,viewMessagefalse,setViewMessagefalse
      }}>
        {children}
      </CartContext.Provider>
    </SessionProvider>
  );
}
//10:51:37