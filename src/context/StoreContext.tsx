import { createContext, ReactNode, useEffect, useState } from "react";
import { food_list } from "../assets/assets";

// Define the structure of the context value
interface StoreContextValue {
  food_list: typeof food_list;
  cartItems: { [key: string]: number };
  addToCart: (itemId: string) => void;
  removeFromCart: (itemId: string) => void;
  getTotalCartAmount: (itemId: string) => void;
}

// Initialize the context with a proper type
export const StoreContext = createContext<StoreContextValue | undefined>(
  undefined
);

// Props interface for the provider
interface Props {
  children: ReactNode;
}

const StoreContextProvider: React.FC<Props> = ({ children }) => {
  const [cartItems, setCartItems] = useState<{ [key: string]: number }>({});

  // Add item to the cart
  const addToCart = (itemId: string) => {
    setCartItems((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1,
    }));
  };

  // Remove item from the cart
  const removeFromCart = (itemId: string) => {
    setCartItems((prev) => {
      if (!prev[itemId]) return prev; // Item not in cart, no change
      const updatedCart = { ...prev };
      updatedCart[itemId] -= 1;

      if (updatedCart[itemId] <= 0) {
        delete updatedCart[itemId]; // Remove item if quantity is zero
      }

      return updatedCart;
    });
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInfo = food_list.find((product) => product._id === item);
        totalAmount += itemInfo.price * cartItems[item];
      }
    }
    return totalAmount;
  };

  // Context value to provide
  const contextValue: StoreContextValue = {
    food_list,
    cartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
