import React, { useEffect, useState } from "react";
import "./Home.css";
import Carousel from "react-material-ui-carousel";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

//toast
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { clearErrors } from "../../actions/userActions";
import { getProduct } from "../../actions/productActions";
import Loader from "../Loader/Loader";
import ProductCard from "../Products/ProductCard";
import CardSkeleton from "../Products/CardSkeleton";

const Home = () => {
  const [firstImgLoaded, setFirstImgLoaded] = useState(false);
  const catergoryImg = [
    "https://www.jiomart.com/images/cms/aw_rbslider/slides/1689762474_Monsoon_Specials_Desktop.jpg?im=Resize=(1680,320)",
    "https://www.jiomart.com/images/cms/aw_rbslider/slides/1689310831_Cooking_needs.jpg?im=Resize=(1680,320)",
  ];
  const brandImg = new Map();
  brandImg.set(
    "https://res.cloudinary.com/dmz2azdkb/image/upload/f_auto,q_auto/v1/brands/ithwagjjdcqxckmtw46t",
    "AMUL"
  );
  brandImg.set(
    "https://res.cloudinary.com/dmz2azdkb/image/upload/f_auto,q_auto/v1/brands/kvivjr469bjbgxldx1a4",
    "TATA"
  );

  brandImg.set(
    "https://res.cloudinary.com/dmz2azdkb/image/upload/f_auto,q_auto/v1/brands/b0st13z3nkyw1rj9dk0g",
    "SAFFOLA"
  );
  brandImg.set(
    "https://res.cloudinary.com/dmz2azdkb/image/upload/f_auto,q_auto/v1/brands/trmmgl6ravja1eao8amo",
    "AASHIRVAAD"
  );
  const brandImages = Array.from(brandImg.keys());
  const dispatch = useDispatch();

  const { loading, products, error } = useSelector((state) => state.products);
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
  }, [dispatch, error]);
  useEffect(() => {
    dispatch(getProduct());
  }, [dispatch]);
  return !catergoryImg ? (
    <Loader />
  ) : (
    <>
      <img
        src={catergoryImg[0]}
        onLoad={() => setFirstImgLoaded(true)}
        style={{ display: "none" }}
      />
      {
        firstImgLoaded &&
        <Carousel
          className="carousel"
          autoPlay={false}
          swipe={true}
        >
          {catergoryImg.map((i, index) => (
            <Link to={"/products/&category=Staples"}>
              <img
                className="CarouselImage"
                src={i}
                key={index}
                alt={`${index} Slide`}
              />
            </Link>
          ))}
        </Carousel>
      }
      <h3>Top Brands</h3>
      <div className="brandsDiv">
        <div className="brandsContainer">
          {brandImages.map((i, index) => (
            <Link
              className="brandImg"
              to={`/products/&brand=${brandImg.get(i)}`}
            >
              <img src={i} alt={index} />
            </Link>
          ))}
        </div>
      </div>

      <h3>Top Products</h3>
      {loading ? (
        <div className="productsDiv">
          <CardSkeleton cards={8} />
        </div>
      ) : (
        <div className="productsDiv">
          {products &&
            products
              .slice(
                0,
                products.length > 8
                  ? products.length - (products.length % 4)
                  : products.length
              )
              .map((i) => <ProductCard i={i} />)}
        </div>
      )}

      <ToastContainer />
    </>
  );
};

export default Home;
