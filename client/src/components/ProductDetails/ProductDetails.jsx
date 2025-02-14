import React, { useEffect, useState } from "react";
import "./ProductDetails.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import Carousel from "react-material-ui-carousel";
import { useDispatch, useSelector } from "react-redux";
import ProductCard from "../Products/ProductCard.jsx";
//toast
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  getProduct,
  getProductDetails,
  newReview,
} from "../../actions/productActions";
import { clearErrors } from "../../actions/userActions";
import Loader from "../Loader/Loader";
import { addItemsToCart, getItems } from "../../actions/cartActions";
import ReviewCard from "./ReviewCard";
import { Rating } from "@mui/lab";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@mui/material";
import { NEW_REVIEW_RESET } from "../../constants/productConstants";

const ProductDetails = () => {
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);
  const { id } = useParams();
  const { cartItems } = useSelector((state) => state.cart);
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const { shippingInfo } = useSelector((state) => state.cart);
  const history = useNavigate();
  const { product, loading, error } = useSelector(
    (state) => state.productDetails
  );
  const { loading: loading1, products } = useSelector(
    (state) => state.products
  );
  const {
    loading: userLoading,
    user,
    isAuthenticated,
  } = useSelector((state) => state.user);
  const { success, error: reviewError } = useSelector(
    (state) => state.newReview
  );
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getItems());
    }
  }, [dispatch, isAuthenticated]);
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
    if (reviewError) {
      toast.error(error);
      dispatch(clearErrors());
    }
    if (success) {
      toast.success("Review Submitted Successfully!");
      dispatch({ type: NEW_REVIEW_RESET });
    }
    dispatch(getProductDetails(id));
    dispatch(getProduct());
  }, [id, dispatch, error, reviewError, success]);

  const addToCart = () => {
    if (isAuthenticated) {
      dispatch(addItemsToCart(id, quantity));
      toast.success("Item Added To Cart");
    } else {
      toast.error("Login First!");
    }
  };

  const decreaseQuantity = () => {
    if (1 >= quantity) return;

    const qty = quantity - 1;
    setQuantity(qty);
  };
  const increaseQuantity = () => {
    if (product.Stock <= quantity) {
      toast("Cannot Add More Items");
      return;
    }
    const qty = quantity + 1;
    setQuantity(qty);
  };
  const reviewSubmitHandler = () => {
    const myForm = new FormData();
    myForm.set("rating", rating);
    myForm.set("comment", comment);
    myForm.set("productId", id);
    dispatch(newReview(myForm));
    setOpen(false);
  };
  const options = {
    size: "large",
    value: product.ratings,
    readOnly: true,
    precision: 0.5,
  };
  return (
    <div className="bodyDiv">
      {loading || userLoading || loading1 ? (
        <Loader />
      ) : (
        <div className="productDiv">
          <Carousel className="imageDiv" swipe={true} autoPlay={false}>
            {product.images &&
              product.images.map((i, index) => (
                <img
                  className="carousel-img"
                  src={i.url}
                  key={index}
                  alt={`${index} Slide`}
                />
              ))}
          </Carousel>
          <div className="descriptionDiv">
            <h3>{product.name}</h3>
            <p className="productBrand">
              Brand:
              <b>{product.brand && product.brand.toUpperCase()}</b>
            </p>
            <h2>{`₹${product.price}`}</h2>
            <a href="#reviewDiv">
              <Rating {...options} className="rating" />
              <p>{`(${product.numOfReviews} Reviews)`}</p>
            </a>
            <p>
              Status:
              <b className={product.Stock < 1 ? "redColor" : "greenColor"}>
                {product.Stock < 1 ? "OutOfStock" : "InStock"}
              </b>
            </p>
            <hr />
            <div className="cartDiv">
              <div className="quantityDiv">
                <button className="minus" onClick={decreaseQuantity}>
                  -
                </button>
                <input
                  className="number"
                  readOnly
                  type="number"
                  value={quantity}
                />
                <button className="add" onClick={increaseQuantity}>
                  +
                </button>
              </div>
              <button
                disabled={product.Stock < 1 ? true : false}
                className="addToCartButton"
                onClick={addToCart}
              >
                <p>Add To Cart</p>
              </button>
            </div>
            <hr />
            <div className="addressDiv">
              <h2>Deliver To:-</h2>
              {user && user.shippingAddress ? (
                <>
                  <br />
                  <p>{user.shippingAddress.address}</p>
                  <p>State: {user.shippingAddress.state}</p>
                  <p>City: {user.shippingAddress.city}</p>
                  <p>PINCODE: {user.shippingAddress.pinCode}</p>
                  <p>Phone Number: +91 {user.shippingAddress.phoneNo}</p>
                </>
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
      )}
      <div className="productDescriptionDiv">
        <hr />
        <h1>Product Description</h1>
        <p>{product.description}</p>
        <hr />
      </div>

      <h1 className="relatedProductsDiv">Related Products</h1>
      {loading1 ? (
        <Loader />
      ) : (
        <div className="productsSlide">
          {products &&
            products
              .filter(
                (p) =>
                  p.subCategory === product.subCategory && p._id !== product._id
              )
              .map((i, index) => (
                <>
                  <ProductCard i={i} />
                </>
              ))}
        </div>
      )}
      <div className="submitReviewDiv">
        <h1>Reviews</h1>
        <button
          className="submitReview"
          onClick={() => {
            if (!isAuthenticated) {
              toast.error("Login First!");
            } else {
              setComment("");
              setRating(0);
              setIsEditing(false);
              setOpen(!open);
            }
          }}
        >
          Submit Review
        </button>
      </div>
      <Dialog
        aria-aria-labelledby="simple-dialog-title"
        open={open}
        onClose={() => {
          setOpen(!open);
        }}
      >
        <DialogTitle>{isEditing ? `Edit Review` : `Submit Review`}</DialogTitle>
        <DialogContent className="submitDialog">
          <Rating
            onChange={(e) => setRating(e.target.value)}
            value={rating}
            size="large"
          />
          <textarea
            className="submitDialogTextArea"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            cols="30"
            rows="5"
          ></textarea>
          <p className={comment.length>250 ? 'redColor':""}>
            {`${comment.length}/250`}
          </p>
          <DialogActions>
            <Button
              onClick={() => {
                setOpen(!open);
              }}
              color="secondary"
            >
              Cancel
            </Button>
            <Button disabled={comment.length>250 || !rating} onClick={reviewSubmitHandler}>Submit</Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
      {userLoading ? (
        <Loader />
      ) : (
        <div className="reviewsDiv" id="reviewDiv">
          {product.reviews && product.reviews[0] ? (
            product.reviews &&
            product.reviews.map((review) => (
              <ReviewCard
                key={review._id}
                review={review}
                setOpen={setOpen}
                setRating={setRating}
                setComment={setComment}
                user={user}
                setIsEditing={setIsEditing}
              />
            ))
          ) : (
            <p className="noReviews">No Reviews Yet</p>
          )}
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default ProductDetails;
