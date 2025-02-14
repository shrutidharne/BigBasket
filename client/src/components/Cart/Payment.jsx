import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../Loader/Loader";
import { Link, useNavigate } from "react-router-dom";
import CheckOutSteps from "./CheckOutSteps";
import "./Payment.css";
import axios from "axios";

//toast
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { clearErrors } from "../../actions/productActions";
import NotAuthorised from "../Error/NotAuthorised";
import { Typography } from "@mui/material";
import { createOrder } from "../../actions/orderActions";

const Payment = () => {
  const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo"));
  const { shippingInfo, cartItems } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const history = useNavigate();

  const { loading, isAuthenticated, error } = useSelector(
    (state) => state.user
  );
  const [method, setMethod] = useState("UPI");
  const cashOnDelivery = () => {
    console.log(shippingInfo);
    const data = {
      shippingInfo,
      orderItems: cartItems,
      paymentMethod: "Cash On Delivery",
      itemsPrice: orderInfo.subtotal,
      taxPrice: 0,
      shippingPrice: 0,
      totalPrice: orderInfo.totalPrice,
    };
    dispatch(createOrder(data));
    history("/order/successful");
  };

  useEffect(() => {
    if (error) {
      console.log(error);
      toast.error(error);
      dispatch(clearErrors());
    }
  }, [error]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : isAuthenticated ? (
        <>
          <CheckOutSteps activeSteps={2} />

          <div className="mainDiv">
            <div className="amountPayableDiv">
              <h1>Amount Payable</h1>
              <p> {`₹${orderInfo?.totalPrice}`} </p>
            </div>
            <div className="paymentBodyDiv">
              <div className="paymentMehtodDiv">
                <h1
                  className={method === "UPI" ? "backgroundWhite" : ""}
                  onClick={() => setMethod("UPI")}
                >
                  UPI
                </h1>
                <hr />
                <h1
                  className={method === "NETBANKING" ? "backgroundWhite" : ""}
                  onClick={() => setMethod("NETBANKING")}
                >
                  NETBANKING
                </h1>
                <hr />
                <h1
                  className={
                    method === "CREDIT/DEBIT/ATM CARD" ? "backgroundWhite" : ""
                  }
                  onClick={() => setMethod("CREDIT/DEBIT/ATM CARD")}
                >
                  CREDIT/DEBIT/ATM CARD
                </h1>
                <hr />
                <h1
                  className={
                    method === "CASH ON DELIVERY" ? "backgroundWhite" : ""
                  }
                  onClick={() => setMethod("CASH ON DELIVERY")}
                >
                  CASH ON DELIVERY
                </h1>
              </div>
              <div className="cashOnDeliveryDiv">
                {method === "CASH ON DELIVERY" ? (
                  <>
                    <h1>Pay Using Cash On Delivery</h1>
                    <hr />
                    <button className="payButton" onClick={cashOnDelivery}>
                      Pay{` ₹${orderInfo?.totalPrice}`}
                    </button>
                  </>
                ) : method === "UPI" ? (
                  <>
                    <h1>UPI</h1>
                  </>
                ) : method === "NETBANKING" ? (
                  <>
                    <h1>NETBANKING</h1>
                  </>
                ) : method === "CREDIT/DEBIT/ATM CARD" ? (
                  <>
                    <h1>ATM</h1>
                  </>
                ) : (
                  <></>
                )}
              </div>
            </div>
          </div>
        </>
      ) : (
        <NotAuthorised />
      )}
      <ToastContainer />
    </>
  );
};

export default Payment;
