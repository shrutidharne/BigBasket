import React, { useEffect, useState } from "react";
import "./Cart.css";
import { useDispatch, useSelector } from "react-redux";
import {
  addItemsToCart,
  getItems,
  reomveItemsFromCart,
} from "../../actions/cartActions";
import Loader from "../Loader/Loader";
import { Link, useNavigate } from "react-router-dom";
import RemoveShoppingCartIcon from "@mui/icons-material/RemoveShoppingCart";

//toast
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Cart = () => {
  const history = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.user);
  useEffect(() => {
    if (isAuthenticated) {
      // console.log('df');
      dispatch(getItems());
    }
  }, [dispatch, isAuthenticated]);

  const { cartItems, loading } = useSelector((state) => state.cart);
  console.log(cartItems);
  const [quantity, setQuantity] = useState(1);
  const decreaseQuantity = (id, q) => {
    if (1 >= q) {
      deletCartItems(id);
    } else {
      dispatch(addItemsToCart(id, q - 1));
    }
    // dispatch(addItemsToUser());
  };
  const increaseQuantity = (id, q, stock) => {
    console.log(stock);
    if (stock <= q) {
      toast("Cannot Add More Items");
      return;
    }
    dispatch(addItemsToCart(id, q + 1));
    // dispatch(addItemsToUser());
  };

  const deletCartItems = (id) => {
    dispatch(reomveItemsFromCart(id));
    // dispatch(addItemsToUser());
  };
  const placeOrderhandler = () => {
    history("/auth/signin?redirect=shipping");
  };
  return (
    <>
      {loading ? (
        <Loader />
      ) : cartItems.length ? (
        <>
          {" "}
          <h1 className="myCart">My Cart({cartItems.length} Items) </h1>
          <hr className="invisible"/>
          <div className="cartbodyDiv">
            <div className="productListDiv">
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
                        <p
                          className="invertedInvisible"
                          onClick={() => deletCartItems(product.product)}
                        >
                          Remove
                        </p>
                        <p>
                          Status:
                          <b
                            className={
                              product.Stock < quantity
                                ? "redColor"
                                : "greenColor"
                            }
                          >
                            {product.Stock < quantity
                              ? "OutOfStock"
                              : "InStock"}
                          </b>
                        </p>
                      </div>

                      <div className="quantityDiv1">
                        <button
                          className="minus"
                          onClick={() =>
                            decreaseQuantity(product.product, product.quantity)
                          }
                        >
                          -
                        </button>
                        <input
                          className="number"
                          readOnly
                          type="number"
                          value={product.quantity}
                        />
                        <button
                          className="add"
                          onClick={() =>
                            increaseQuantity(
                              product.product,
                              product.quantity,
                              product.stock
                            )
                          }
                        >
                          +
                        </button>
                      </div>
                    </div>
                    {index === cartItems.length - 1 ? <></> : <hr />}
                  </>
                ))}
              <hr className="invisible" />
            </div>
            <div className="orderTotalParentDiv">
              <div className="orderTotalDiv">
                <h1>Payment Details</h1>
                <p>
                  <h5>MRP Total</h5>
                  <p>
                    {`₹${cartItems.reduce(
                      (total, curr) => total + curr.price * curr.quantity,
                      0
                    )}`}
                  </p>
                </p>
                <hr />
                <p>
                  <h5>Delivery Fee</h5>
                  <h4>Free </h4>
                </p>
                <hr />
                <p>
                  <h5>Total</h5>
                  <p>
                    {`₹${cartItems.reduce(
                      (total, curr) => total + curr.price * curr.quantity,
                      0
                    )}`}
                  </p>
                </p>
              </div>
              <button className="placeOrderLink" onClick={placeOrderhandler}>
                <p>Place Order</p>
              </button>
            </div>
            <ToastContainer />
          </div>
          <div className="placeOrderStrip">
            <div>
              <h5>MRP Total</h5>
              <p>
                {`₹${cartItems.reduce(
                  (total, curr) => total + curr.price * curr.quantity,
                  0
                )}`}
              </p>
            </div>
            <button onClick={placeOrderhandler}>
              <p>Place Order</p>
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="noItems">
            <RemoveShoppingCartIcon />
            <h1>No Products In your Cart</h1>
            <Link to={"/#"} className="browseProducts">
              Browse Products
            </Link>
          </div>
        </>
      )}
    </>
  );
};

export default Cart;
