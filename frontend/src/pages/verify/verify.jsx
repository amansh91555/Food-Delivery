import React, { useContext, useEffect, useState } from 'react';
import "./verify.css";
import { useSearchParams } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';

const Verify = () => {
  const [searchParams] = useSearchParams();
  const success = searchParams.get("success");
  const orderId = searchParams.get("orderId");

  const { url } = useContext(StoreContext);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const response = await axios.post(url + "/api/order/verify", { success, orderId });

        if (response.data.success) {
          setUserId(response.data.userId);
        } else {
          setUserId("Payment failed. No user ID found.");
        }
      } catch (error) {
        console.error("Verification failed:", error);
        setUserId("Error verifying payment.");
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      verifyPayment();
    }, 5000);

    return () => clearTimeout(timer);
  }, [success, orderId, url]);

  return (
    <div className="verify">
      {loading ? (
        <div className="fade-in">
          <div className="spinner"></div>
          <p className="loading-text">Your order is processing. Please wait...</p>
        </div>
      ) : (
        <p className="result-text">
          {userId === "Payment failed. No user ID found."
            ? "❌ Payment failed."
            : `✅ Your order is verified. User ID: ${userId}`}
        </p>
      )}
    </div>
  );
};

export default Verify;
