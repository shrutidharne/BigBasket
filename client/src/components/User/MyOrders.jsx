import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../Loader/Loader";
import { Link, useNavigate } from "react-router-dom";
import "./MyOrders.css";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

//toast
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { clearErrors } from "../../actions/productActions";
import NotAuthorised from "../Error/NotAuthorised";
import { saveOrder } from "../../actions/orderActions";

const MyOrders = () => {
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.order.orders);
  console.log(orders);
  const history = useNavigate();
  const { loading, isAuthenticated, error } = useSelector(
    (state) => state.user
  );

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

  return (
    <>
      {loading ? (
        <Loader />
      ) : isAuthenticated ? (
        <>
          <div className="orderBodyDiv">
            <h1>Your Orders</h1>
            {orders &&
              orders
                .slice()
                .reverse()
                .map((order, index) => (
                  <>
                    <div>
                      <Link
                        to={`/my/order-details/${orders.length - 1 - index}`}
                        key={order._id}
                        className="orderCard"
                      >
                        <p className="orderPriceDiv">{`₹${order.totalPrice} (${order.orderItems.length} Items)`}</p>
                        <p
                          className={`orderStatus ${
                            order.orderStatus === "processing"
                              ? ""
                              : order.orderStatus === "Shipped"
                              ? "redColor"
                              : "greenColor"
                          }`}
                        >
                          {order.orderStatus}{" "}
                        </p>
                        {order.orderItems.slice(0, 4).map((item) => (
                          <div key={item._id}>
                            <img src={item.image} alt={item.name} />
                          </div>
                        ))}
                        {order.orderItems.length > 4 ? (
                          <>
                            <h1 className="moreItemsDiv">
                              +{order.orderItems.length - 4}
                            </h1>
                          </>
                        ) : (
                          <></>
                        )}
                        <div className="arrowForwardDiv">
                          <ArrowForwardIosIcon />
                        </div>
                      </Link>
                    </div>
                  </>
                ))}
          </div>
        </>
      ) : (
        <NotAuthorised />
      )}
      <ToastContainer />
    </>
  );
};

export default MyOrders;
