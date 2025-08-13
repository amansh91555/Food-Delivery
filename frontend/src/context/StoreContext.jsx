
import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

// Create context
export const StoreContext = createContext(null);

const StoreContextProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState({});
  const [food_list, setFoodList] = useState([]); // ✅ use `food_list`
  const [token, setToken] = useState("");
  const url = "http://localhost:4000";

  // ✅ Add to cart & sync with backend
  const addToCart = async (itemId) => {
    setCartItems((prev) => ({
      ...prev,
      [itemId]: prev[itemId] ? prev[itemId] + 1 : 1,
    }));

    if (token) {
      await axios.post(
        `${url}/api/cart/add`,
        { itemId },
        { headers: { token } }
      );
    }
  };

  // ✅ Remove from cart & sync with backend
  const removeFromCart = async (itemId) => {
    setCartItems((prev) => ({
      ...prev,
      [itemId]: prev[itemId] > 0 ? prev[itemId] - 1 : 0,
    }));

    if (token) {
      await axios.post(
        `${url}/api/cart/remove`,
        { itemId },
        { headers: { token } }
      );
    }
  };

  // ✅ Calculate total amount
  const getTotalCartAmount = () => {
    let total = 0;
    for (const itemId in cartItems) {
      if (cartItems[itemId] > 0) {
        const itemInfo = food_list.find((p) => p._id === itemId); // ✅ use `food_list`
        if (itemInfo) {
          total += itemInfo.price * cartItems[itemId];
        }else{
            console.log("Item Not Fetched")
        }
      }
    }
    return total;
  };

  // ✅ Fetch food list
   const fetchFoodList=async()=>{
        // using get:-because food list api is created using get method.
        const response=await axios.get(url+"/api/food/list");
        setFoodList(response.data.data);
    }

     const loadCartData=async(token)=>{
        const response=await axios.post(url+"/api/cart/get",{},{headers:{token}});
        setCartItems(response.data.cartData);
    }

      useEffect(()=>{
        try{
        async function loadData(){
            await fetchFoodList();
            if(localStorage.getItem("token")){
                setToken(localStorage.getItem("token"));
                await loadCartData(localStorage.getItem("token"));
            }
        }
        loadData();
    }
    catch(err){
        console.log(err);
    }

    },[])

  const contextValue = {
    food_list,   // ✅ provide `food_list`
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    url,
    token,
    setToken,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;

