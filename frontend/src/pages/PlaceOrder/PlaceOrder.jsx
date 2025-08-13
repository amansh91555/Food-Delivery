import React, { useContext, useState } from 'react';
import './PlaceOrder.css';
import axios from 'axios';
import { StoreContext } from '../../context/StoreContext';

const PlaceOrder = () => {
  const { getTotalCartAmount, token, food_list, cartItems, url, userId } = useContext(StoreContext);
  
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: ""
  });

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  const placeOrder = async (event) => {
    event.preventDefault();

    let orderItems = [];
    food_list.forEach((item) => {
      if (cartItems[item._id] > 0) {
        orderItems.push({
          ...item,
          quantity: cartItems[item._id]
        });
      }
    });

    let orderData = {
      userId, // ✅ Added userId for backend
      address: data,
      items: orderItems,
      amount: getTotalCartAmount() + 2,
    };

    try {
      let response = await axios.post(`${url}/api/order/place`, orderData, {
        headers: { token }
      });

      if (response.data.success) {
        const { session_url } = response.data;
        window.location.replace(session_url);
      } else {
        alert("Error placing order");
      }
    } catch (error) {
      console.error("Order placement failed", error);
      alert("Something went wrong!");
    }
  };

  return (
    <form onSubmit={placeOrder} className="place-order">
      <div className="place-order-left">
        <p className="title">Delivery Information</p>
        <div className="multi-fields">
          <input name="firstName" onChange={onChangeHandler} value={data.firstName} type="text" placeholder="First Name" />
          <input name="lastName" onChange={onChangeHandler} value={data.lastName} type="text" placeholder="Last Name" />
        </div>
        <input name="email" onChange={onChangeHandler} value={data.email} type="email" placeholder="Email-address" />
        <input name="street" onChange={onChangeHandler} value={data.street} type="text" placeholder="Street" />
        <div className="multi-fields">
          <input name="city" onChange={onChangeHandler} value={data.city} type="text" placeholder="City" />
          <input name="state" onChange={onChangeHandler} value={data.state} type="text" placeholder="State" />
        </div>
        <div className="multi-fields">
          <input name="zipcode" onChange={onChangeHandler} value={data.zipcode} type="text" placeholder="Zip-Code" />
          <input name="country" onChange={onChangeHandler} value={data.country} type="text" placeholder="Country" />
        </div>
        <input name="phone" onChange={onChangeHandler} value={data.phone} type="text" placeholder="Phone" />
      </div>

      <div className="place-order-right">
        <h2>Cart Totals</h2>
        <div className="cart-total-details">
          <p>Subtotal:</p>
          <p>{getTotalCartAmount()}</p>
        </div>
        <hr />
        <div className="cart-total-details">
          <p>Delivery Fee:</p>
          <p>${getTotalCartAmount() === 0 ? 0 : 5}</p>
        </div>
        <hr />
        <div className="cart-total-details">
          <p>Total:</p>
          <p>${getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 5}</p>
        </div>
        <button type="submit">PROCEED TO PAYMENT</button>
      </div>
    </form>
  );
};

export default PlaceOrder;

