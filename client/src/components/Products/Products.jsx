import React, { useEffect, useState } from "react";
import "./Product.css";
import { useSelector, useDispatch } from "react-redux";
import {
  clearErrors,
  getProduct,
  getProductsByBrands,
} from "../../actions/productActions";
import Loader from "../Loader/Loader";
import ProductCard from "./ProductCard";
import { useParams } from "react-router-dom";
import { Skeleton, Slider, Typography } from "@mui/material";

//toast
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CardSkeleton from "./CardSkeleton";

// import MetaData from '../layout/MetaData';
let brand = [];
const Products = () => {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [price, setPrice] = useState([0, 999]);
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");

  const [ratings, setRatings] = useState(0);
  const { products, loading, error, getBrands, filteredProductsCount } =
    useSelector((state) => state.products);
  const { keyword } = useParams();
  const priceHandler = (event, newPrice) => {
    setPrice(newPrice);
  };

  const handleCheckboxChange = (event, p) => {
    const isChecked = event.target.checked;

    if (isChecked) {
      brand.push(p);
    } else {
      brand = brand.filter((item) => item !== p);
    }
    dispatch(
      getProductsByBrands(
        keyword,
        currentPage,
        price,
        category,
        brand,
        getBrands,
        subCategory,
        ratings
      )
    );
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
  }, [error]);


  useEffect(() => {
    dispatch(
      getProduct(keyword, currentPage, price, category, subCategory, ratings)
    );
  }, [dispatch, keyword, currentPage, category, subCategory]);
  const getProductsByPrice = () => {
    dispatch(
      getProduct(keyword, currentPage, price, category, subCategory, ratings)
    );
  };
  let count = filteredProductsCount;

  return (
    <>
      {loading ? (
        <div className="productsWrapper">
          <div className="filterBoxSkeleton">
            <span>
              <Skeleton height={'10vmax'} />
            </span>
            <h1>
              <Skeleton />
            </h1>
            <ul className="categoryBox">
              {
                Array(8).fill(0).map((_, i) => (
                  <li className="category-link" key={i}>
                    <label>
                      <Skeleton />
                    </label>
                  </li>
                ))
              }
            </ul>
            <div>
              <Skeleton height={'8vmax'}/>
            </div>
          </div>
          <div className="mainDiv1">
              <h2 className="productsHeading">Products</h2>
              <div className="products">
                <CardSkeleton cards={8}/>
              </div>
            </div>
        </div>
      ) : !products || products.length === 0 ? (
        <>
          <div className="noProducts">
            <div className="filterBox">
              <Typography>Price</Typography>
              <Slider
                aria-label="Always visible"
                value={price}
                onChange={priceHandler}
                onChangeCommitted={getProductsByPrice}
                valueLabelDisplay="auto"
                aria-labelledby="range-slider"
                min={0}
                max={2000}
              />
              <Typography>Brands</Typography>
              <ul className="categoryBox">
                {getBrands &&
                  getBrands.map((p) => (
                    <li className="category-link" key={p}>
                      <label>
                        <input
                          type="checkbox"
                          checked={
                            brand.find((val) => val === p) ? true : false
                          }
                          onChange={(e) => handleCheckboxChange(e, p)}
                        />
                        {p.toUpperCase()}
                      </label>
                    </li>
                  ))}
              </ul>
              <fieldset>
                <Typography component="legend" className="rating-legend">
                  Ratings Above
                </Typography>
                <Slider
                  value={ratings}
                  onChange={(e, newRating) => {
                    setRatings(newRating);
                  }}
                  onChangeCommitted={getProductsByPrice}
                  aria-labelledby="continuous-slider"
                  min={0}
                  max={5}
                  className="rating-slider"
                  valueLabelDisplay="auto"
                />
              </fieldset>
            </div>
            <div className="no-products">
              <h1>NO PRODUCTS TO DISPLAY!</h1>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="productsWrapper">
            <div className="filterBox">
              <Typography>Price</Typography>
              <Slider
                aria-label="Always visible"
                value={price}
                onChange={priceHandler}
                onChangeCommitted={getProductsByPrice}
                valueLabelDisplay="auto"
                aria-labelledby="range-slider"
                min={0}
                max={2000}
              />
              <div className="priceInput">
                <div>
                  <input
                    type="number"
                    placeholder="min"
                    value={price[0]}
                    onChange={(e) => setPrice([e.target.value, price[1]])}
                  />
                  <p>to</p>
                  <input
                    type="number"
                    placeholder="max"
                    value={price[1]}
                    onChange={(e) => setPrice([price[0], e.target.value])}
                  />
                </div>
                <button
                  onClick={() => {
                    getProductsByPrice();
                  }}
                >
                  Go
                </button>
              </div>
              <Typography>Brands</Typography>
              <ul className="categoryBox">
                {getBrands &&
                  getBrands.map((p) => (
                    <li className="category-link" key={p}>
                      <label>
                        <input
                          type="checkbox"
                          checked={
                            brand.find((val) => val === p) ? true : false
                          }
                          onChange={(e) => handleCheckboxChange(e, p)}
                        />
                        {p.toUpperCase()}
                      </label>
                    </li>
                  ))}
              </ul>
              <fieldset>
                <Typography component="legend" className="rating-legend">
                  Ratings Above
                </Typography>
                <Slider
                  value={ratings}
                  onChange={(e, newRating) => {
                    setRatings(newRating);
                  }}
                  onChangeCommitted={getProductsByPrice}
                  aria-labelledby="continuous-slider"
                  min={0}
                  max={5}
                  className="rating-slider"
                  valueLabelDisplay="auto"
                />
              </fieldset>
            </div>
            {/* <MetaData title={'Products -- Ecommerce'}/> */}
            <div className="mainDiv1">
              <h2 className="productsHeading">Products</h2>
              <div className="products">
                {products &&
                  products.map((product) => <ProductCard i={product} />)}
              </div>
            </div>
          </div>
          <ToastContainer />
        </>
      )}
    </>
  );
};

export default Products;
