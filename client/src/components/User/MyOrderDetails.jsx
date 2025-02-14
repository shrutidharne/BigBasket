import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../Loader/Loader";
import { Link, useNavigate, useParams } from "react-router-dom";
import "./MyOrderDetails.css";
import { saveOrder } from "../../actions/orderActions";

//toast
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { clearErrors } from "../../actions/productActions";
import NotAuthorised from "../Error/NotAuthorised";
import { Typography } from "@mui/material";

const ConfirmOrder = () => {
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.order.orders);
  console.log(orders);
  const history = useNavigate();
  const { loading, isAuthenticated, error } = useSelector(
    (state) => state.user
  );

  const { id } = useParams();

  useEffect(() => {
    dispatch(saveOrder());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      console.log(error);
      toast.error(error);
      dispatch(clearErrors());
    }
  }, [error, dispatch]);

  const { user } = useSelector((state) => state.user);

  const { shippingInfo, cartItems } = useSelector((state) => state.cart);

  const address = `${orders[id].shippingInfo.address}, ${
    orders[id].shippingInfo.city
  }, ${orders[id].shippingInfo.state}, ${
    orders[id].shippingInfo.pinCode
  }, ${`India`}`;

  const delivery = 0;

  return (
    <>
      {loading ? (
        <Loader />
      ) : isAuthenticated ? (
        <>
          <div className="MyorderDetailsPage">
            <div className="confirmShippingArea">
              <div className="orderOverview">
                <h1>Order Details</h1>
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
                  <>
                    <div>
                      {orders &&
                        orders[id].orderItems.map((item) => (
                          <Link
                            to={`/my/order-details/${orders.length - 1 - id}`}
                            key={item._id}
                            className="myOrderDetailsCard"
                          >
                            <div key={item._id}>
                              <img src={item.image} alt={item.name} />
                            </div>
                            <p>{item.name} </p>
                            <p>
                              {item.quantity} X ₹{item.price} = ₹
                              {item.quantity * item.price}
                            </p>
                          </Link>
                        ))}
                    </div>
                  </>
                </div>
              </div>
            </div>

            <div className="orderSummaryContainer">
              <div className="orderSummary">
                <h1>Payment Details</h1>

                <div className="price">
                  <div className="subtotal">
                    <h1>Subtotal </h1>
                    <p> ₹{orders && orders[id].totalPrice}</p>
                  </div>
                  <hr />
                  <div className="gst">
                    <h1>Delivery </h1>
                    <p> ₹{delivery}</p>
                  </div>
                  <hr />

                  <div className="totalPrice">
                    <h1>Total </h1>
                    <p> ₹{orders && orders[id].totalPrice}</p>
                  </div>
                </div>
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

export default ConfirmOrder;
