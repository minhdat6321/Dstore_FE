// PaypalCheckout.js

import React, { useState } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useDispatch, useSelector } from "react-redux";
import { createPaypalOrder, capturePaypalOrder } from "./checkoutSlice";
import { convertNumbersToStrings } from "../../utils/convertNumbersToStrings";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { toast } from "react-toastify"; // Import toast from react-toastify

function Message({ content }) {
    return <p>{content}</p>;
}

function PaypalCheckout() {
    let { initialOptions, checkoutSummary } = useSelector((state) => state.checkout);
    const [message, setMessage] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate(); // Initialize useNavigate
    const productsCheckout = useSelector((state) => state.checkout.productsCheckout);
    const { order_ids_new: order_products, checkout_order: order_checkout } = productsCheckout;



    const handleCreateOrder = async () => {
        checkoutSummary = convertNumbersToStrings(checkoutSummary);

        if (!checkoutSummary?.totalCheckout) {
            setMessage("No items to checkout.");
            return;
        }

        try {
            console.log("checkout Summary test string: ", checkoutSummary);
            const orderID = await dispatch(createPaypalOrder(checkoutSummary.totalCheckout));

            if (!orderID) {
                setMessage("Failed to create PayPal order.");
                return null;
            }
            console.log("Order ID passed to PayPalButtons:", orderID);

            return orderID; // Return orderID to PayPal to proceed
        } catch (error) {
            setMessage("Failed to create PayPal order.");
            return null;
        }
    };

    const handleApprove = async (data, actions) => {
        const { orderID } = data;

        try {
            console.log("Paypal checkout, b4 capturePaypalOrder ")
            console.log("order_products:  ", order_products)
            console.log("order_checkout:  ", order_checkout)
            await dispatch(capturePaypalOrder(orderID, order_checkout, order_products));
            // await dispatch(capturePaypalOrder(orderID));
            setMessage("Transaction completed!");

            // Navigate to the success page
            navigate("/success");
        } catch (error) {
            setMessage("Transaction failed.");
            toast.error("Transaction failed. Please try again."); // Show popup notification
        }
    };

    return (
        <div className="PaypalCheckout">
            <PayPalScriptProvider options={initialOptions}>
                <PayPalButtons
                    style={{ layout: "vertical", color: "gold", label: "paypal" }}
                    createOrder={handleCreateOrder}
                    onApprove={handleApprove}
                />
            </PayPalScriptProvider>
            {message && <Message content={message} />}
        </div>
    );
}

export default PaypalCheckout;
