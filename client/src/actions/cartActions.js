import {
  ADD_TO_CART,
  REMOVE_CART_ITEM,
  SAVE_SHIPPING_INFO,
} from "../constants/cartConstants";

import backEndUrl from "../host";
import axios from "axios";

//Add to cart
export const addItemsToCart = (id, quantity) => async (dispatch, getState) => {
  const { data } = await axios.get(
    `${backEndUrl}/api/v1/product/${id}`
  );
  dispatch({
    type: ADD_TO_CART,
    payload: {
      product: data.product._id,
      name: data.product.name,
      price: data.product.price,
      image: data.product.images[0].url,
      stock: data.product.Stock,
      quantity,
    },
  });

  localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));
  await axios.post(
    `${backEndUrl}/api/v1/cart`,
    { cartItems: getState().cart.cartItems },
    { withCredentials: true }
  );
};

//get Items from user
export const getItems = () => async (dispatch, getState) => {
  try {
    let { data } = await axios.get(`${backEndUrl}/api/v1/cart/all`, {
      withCredentials: true,
    });
    data.cart.forEach(async (element) => {
      const { data } = await axios.get(
        `${backEndUrl}/api/v1/product/${element.product}`
      );
      if (data.product.Stock < element.stock) {
        dispatch({
          type: REMOVE_CART_ITEM,
          payload: element.product,
        });
        localStorage.setItem(
          "cartItems",
          JSON.stringify(getState().cart.cartItems)
        );
        await axios.post(
          `${backEndUrl}/api/v1/cart`,
          { cartItems: getState().cart.cartItems },
          { withCredentials: true }
        );
      }
    });
    let { data: data1 } = await axios.get(
      `${backEndUrl}/api/v1/cart/all`,
      {
        withCredentials: true,
      }
    );

    localStorage.setItem("cartItems", JSON.stringify(data1.cart));
  } catch (error) {}
};

export const reomveItemsFromCart = (id) => async (dispatch, getState) => {
  dispatch({
    type: REMOVE_CART_ITEM,
    payload: id,
  });
  localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));
  await axios.post(
    `${backEndUrl}/api/v1/cart`,
    { cartItems: getState().cart.cartItems },
    { withCredentials: true }
  );
};

//Save Shipping info
export const saveShippingInfo = (data) => async (dispatch, getState) => {
  dispatch({
    type: SAVE_SHIPPING_INFO,
    payload: data,
  });
  await axios.post(
    `${backEndUrl}/api/v1/address/save`,
    {shippingInfo:getState().cart.shippingInfo},
    { withCredentials: true }
  );
  localStorage.setItem(
    "shippingInfo",
    JSON.stringify(getState().cart.shippingInfo)
  );
};
