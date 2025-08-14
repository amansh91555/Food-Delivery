import orderModel from "../models/orderModels.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe"
import dotenv from dotenv

dotenv.config();

const stripe= new Stripe(process.env.STRIPE_SECRET_KEY)
//placing user orddr for frontend

const placeOrder = async(req,res)=>{

const frontend_url ="http://localhost:5173";

    try{
        const newOrder=new orderModel({
            userId:req.userId,
            items:req.body.items,
            amount:req.body.amount,
            address:req.body.address
        })
await newOrder.save();
await userModel.findByIdAndUpdate(req.body.userId,{cartData:{}});
const line_items=req.body.items.map((item)=>({
    price_data:{
        currency:"inr",
        product_data:{
            name:item.name
        },
        unit_amount:item.price*100*80
    },
    quantity:item.quantity
}))

line_items.push({
    price_data:{
        currency:"inr",
        product_data:{
            name:"Delivery Charges"
        },
        unit_amount:2*100*80
    },
    quantity:1
})
const session = await stripe.checkout.sessions.create({
    line_items:line_items,
    mode:"payment",
    success_url:`${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
    cancel_url:`${frontend_url}/verify?success=false&orderId=${newOrder._id}`
})

res.json({success:true,session_url:session.url})
    }
    catch(error){
   console.log(error);
   res.json({success:false,message:error})
    }
   
}

// payment verification system


const verifyOrder = async (req, res) => {
  const { orderId, success } = req.body; // Using POST request body

  try {
    const order = await orderModel.findById(orderId);

    if (!order) {
      return res.json({ success: false, message: "Order not found", userId: null });
    }

    if (String(success).toLowerCase() === "true") {
      order.payment = true; // mark payment as completed
      await order.save();
      return res.json({
        success: true,
        message: "Payment successful",
        userId: order.userId
      });
    } else {
      // Keep the order record but mark it as failed
      order.payment = false;
      await order.save();
      return res.json({
        success: false,
        message: "Payment failed",
        userId: order.userId
      });
    }
  } catch (error) {
    console.error("Error verifying order:", error);
    res.json({ success: false, message: "Error", userId: null });
  }
};




export { placeOrder, verifyOrder };
