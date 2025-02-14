import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../Loader/Loader";
import { Link, useNavigate } from "react-router-dom";
import CheckOutSteps from "./CheckOutSteps";
import "./ConfirmOrder.css";

//toast
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { clearErrors } from "../../actions/productActions";
import NotAuthorised from "../Error/NotAuthorised";
import { Typography } from "@mui/material";

const ConfirmOrder = () => {
  const dispatch = useDispatch();
  const { loading, isAuthenticated, error } = useSelector(
    (state) => state.user
  );

  const history = useNavigate();

  useEffect(() => {
    if (error) {
      console.log(error);
      toast.error(error);
      dispatch(clearErrors());
    }
  }, [error]);

  const { shippingInfo, cartItems } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0
  );

  const address = `${shippingInfo.address}, ${shippingInfo.city}, ${
    shippingInfo.state
  }, ${shippingInfo.pinCode}, ${`India`}`;

  const delivery = 0;

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.quantity * item.price + delivery,
    0
  );

  const proceedToPayment = () => {
    const data = {
      subtotal,
      delivery,
      totalPrice,
    };
    sessionStorage.setItem("orderInfo", JSON.stringify(data));
    history("/proceed/payment");
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : isAuthenticated ? (
        <>
          <CheckOutSteps activeSteps={1} />

          <div className="confirmOrderPage">
            <div className="confirmShippingArea">
              <div className="orderOverview">
                {" "}
                <h1>Order Overview</h1>{" "}
              </div>
              <div className="confirmShippingAreaBox">
                <div>
                  <h1 className="addressHeader">
                    Delivery Address <hr />
                  </h1>
                  <p>
                    {user.name}
                    <br />
                    {address}
                    <br />

                    {shippingInfo.phoneNo}
                  </p>
                </div>
              </div>

              <div className="itemContainer">
                <div className="productListDiv1">
                  <h1>Your Cart Items</h1>
                  {cartItems &&
                    cartItems.map((product, index) => (
                      <>
                        <div className="cartProduct">
                          <Link to={`/product/${product.product}`}>
                            <img src={product.image}></img>
                          </Link>
                          <Link to={`/product/${product.product}`}>
                            <p>{product.name}</p>
                          </Link>
                          <div className="priceDiv">
                            <h3>{`₹${product.price}`}</h3>
                          </div>
                          <div className="subtotalPrice">
                            <h3>
                              {" "}
                              {`₹${product.price} X ${product.quantity} = ${
                                product.price * product.quantity
                              }`}{" "}
                            </h3>
                          </div>
                        </div>
                        {index === cartItems.length - 1 ? <></> : <hr />}
                      </>
                    ))}
                </div>
              </div>
            </div>
            <div className="orderSummaryContainer">
              <div className="orderSummary">
                <h1>Payment Details</h1>

                <div className="price">
                  <div className="subtotal">
                    <h1>Subtotal </h1>
                    <p> ₹{subtotal}</p>
                  </div>
                  <hr />
                  <div className="gst">
                    <h1>Delivery </h1>
                    <p> ₹{delivery}</p>
                  </div>
                  <hr />

                  <div className="totalPrice">
                    <h1>Total </h1>
                    <p> ₹{totalPrice}</p>
                  </div>
                </div>
              </div>
              <button className="proceedToPayment" onClick={proceedToPayment}>
                Proceed To Payment
              </button>
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

export default ConfirmOrder;
