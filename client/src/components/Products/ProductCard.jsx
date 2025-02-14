import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../Loader/Loader";
import "./ProductCard.css";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import { addItemsToCart, reomveItemsFromCart } from "../../actions/cartActions";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProductCard = (i) => {
  const dispatch = useDispatch();
  const history = useNavigate();
  const { cartItems, loading } = useSelector((state) => state.cart);
  const { isAuthenticated, loading: loading1 } = useSelector(
    (state) => state.user
  );
  const decreaseQuantity = (id, q) => {
    if (1 >= q) {
      dispatch(reomveItemsFromCart(id));
    } else {
      dispatch(addItemsToCart(id, q - 1));
    }
  };
  const increaseQuantity = (id, q, stock) => {
    console.log(stock);
    if (stock <= q) {
      return;
    }
    dispatch(addItemsToCart(id, q + 1));
  };

  return loading || loading1 ? (
    <Loader />
  ) : (
    <Link className="productInfo" to={`/product/${i.i._id}`} target="_blank">
      <>
        {i.i.images.length ? (
          <img
            src={i.i.images[0].url}
            alt="product image"
            className="productImage"
          />
        ) : (
          <>
            <img src={""} alt="product image" className="productImage" />
          </>
        )}
        <p className="productDescription">{`${i.i.name.slice(0, 50)}${
          i.i.name.length > 50 ? "..." : ""
        }`}</p>
        {/* <p className="productDescription">{i[2]}</p> */}
        <br />
        <p className="price">{`₹${i.i.price}`}</p>
        {cartItems.find((item) => item.product === i.i._id) ? (
          <div className="quantityDiv2">
            <Link
              className="minus1"
              onClick={() =>
                decreaseQuantity(
                  i.i._id,
                  cartItems.find((item) => item.product === i.i._id).quantity
                )
              }
            >
              <RemoveCircleIcon />
            </Link>
            <p className="number1">
              {cartItems.find((item) => item.product === i.i._id).quantity}
            </p>
            <Link
              className="add1"
              onClick={() =>
                increaseQuantity(
                  i.i._id,
                  cartItems.find((item) => item.product === i.i._id).quantity,
                  i.i.Stock
                )
              }
            >
              <AddCircleIcon />
            </Link>
          </div>
        ) : (
          <Link
            className="addToCart"
            onClick={() => {
              if (isAuthenticated) {
                if(i.i.Stock<1){
                  toast("Cannot Add this Item");
                  return;
                }
                dispatch(addItemsToCart(i.i._id, 1, i.i.Stock));
              } else {
                toast.error("Login First!");
              }
            }}
          >
            <p>Add</p>
            <span>+</span>
          </Link>
        )}
      </>
    </Link>
  );
};

export default ProductCard;
