import React, { useEffect, useState } from "react";
import "./newProduct.css";
import { Button, CircularProgress } from "@mui/material";
import {
  AccountTree,
  Description,
  Storage,
  Spellcheck,
  AttachMoney,
} from "@mui/icons-material";
import Sidebar from "./Sidebar";
import { UPDATE_PRODUCT_RESET } from "../../constants/productConstants";
//toast
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useDispatch, useSelector } from "react-redux";
import { clearErrors } from "../../actions/userActions";
import { useNavigate, useParams } from "react-router-dom";
import { updateProduct, getProductDetails } from "../../actions/productActions";
import Loader from "../Loader/Loader";
import NotAuthorised from "../Error/NotAuthorised";

const brands = [
  "ashirvaad",
  "Fortune",
  "Good Life",
  "TATA",
  "kissan",
  "Everest",
];

const categories = new Map();
categories.set("Staples", [
  "Atta Flours & Sooji",
  "Dals & Pulses",
  "Rice & Rice Products",
  "Edible Oils",
  "Masalas & Spcies",
]);
categories.set("Dairy & Bakery", [
  "Dairy",
  "Toast & Khari",
  "Cakes & Muffinss",
  "Breads and Buns",
  "Baked Cookies",
  "Bakery Snacks",
  "Cheese",
  "Ghee",
  "Paneer & Tofu",
]);
categories.set("Snacks", [
  "Biscuits & Cookies",
  "Noodle, Pasta, Vermicelli",
  "Breakfast Cereals",
  "Namkeen",
  "Chocolates & Candies",
  "Ready To Cook & Eat",
  "Frozen Veggies & Snacks",
  "Spreads, Sauces, Ketchup",
  "Indian Sweets",
  "Pickles & Chutney",
  "Extracts & Flavouring",
  "Hampers & Gourmet Gifts",
]);
categories.set("Beverages", [
  "Tea",
  "Coffee",
  "Fruit juices",
  "Energy & Soft Drinks",
  "Health Drink & Supplement",
  "Soda & Flavoured Water",
]);
categories.set("Home Care", [
  "Detergents",
  "Dishwash",
  "All Purpose Cleaners",
  "Fresheners & Repellents",
  "Shoe Care",
  "Pet Supplies",
]);
categories.set("Kitchen", [
  "Disposables",
  "Bottles",
  "Dishes & Containers",
  "Tablewares",
]);
const UpdateProduct = () => {
  const keysArray = Array.from(categories.keys());
  const { productId } = useParams();
  const dispatch = useDispatch();
  const history = useNavigate();
  const {
    loading: loading1,
    user,
    isAuthenticated,
  } = useSelector((state) => state.user);
  const {
    loading,
    error: updateError,
    isUpdated,
  } = useSelector((state) => state.product);
  const { error, product } = useSelector((state) => state.productDetails);
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [Stock, setStock] = useState(0);
  const [images, setImages] = useState([]);
  const [oldimages, setOldImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);
  const [index, setIndex] = useState(0);
  const [temp, setTemp] = useState(0);

  useEffect(() => {
    if (product && product._id !== productId) {
      dispatch(getProductDetails(productId));
    } else {
      setName(product.name);
      setDescription(product.description);
      setPrice(product.price);
      console.log(product.Stock);
      setStock(product.Stock);
      setOldImages(product.images);
      setCategory(product.category);
      setSubCategory(product.subCategory);
      setOldImages(product.images);
      setBrand(product.brand);
      setTemp(1);
    }
    if (error) {
      console.log(error);
      toast.error(error);
      dispatch(clearErrors());
    }
    if (isUpdated) {
      toast.success("Product Updated Successfully!");
      dispatch({ type: UPDATE_PRODUCT_RESET });
      dispatch(getProductDetails(productId));
      setImagesPreview([]);
    }
    if (updateError) {
      toast.error(updateError);
      dispatch(clearErrors());
    }
  }, [dispatch, error, history, isUpdated, productId, product, updateError]);

  const createProductSubmitHandler = (e) => {
    e.preventDefault();
    if (oldimages.length) {
      const form = {
        name: name,
        price: price,
        description: description,
        category: category,
        Stock: Stock,
        brand: brand.toUpperCase(),
        subCategory: subcategory,
      };
      console.log(Stock);
      dispatch(updateProduct(productId, form));
    } else {
      const form = {
        name: name,
        price: price,
        description: description,
        category: category,
        Stock: Stock,
        brand: brand.toUpperCase(),
        subCategory: subcategory,
        images: images,
      };

      dispatch(updateProduct(productId, form));
    }
  };
  document.addEventListener("wheel", function (event) {
    if (document.activeElement.type === "number") {
      document.activeElement.blur();
    }
  });
  const updateProductImagesChange = (e) => {
    const files = Array.from(e.target.files);

    setImages([]);
    setImagesPreview([]);
    setOldImages([]);

    files.forEach((file) => {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
          setImagesPreview((old) => [...old, reader.result]);
          setImages((old) => [...old, reader.result]);
        }
      };

      reader.readAsDataURL(file);
    });
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    if (e.target.selectedIndex > 0) {
      setIndex(e.target.selectedIndex);
    }
    setTemp(e.target.selectedIndex);
  };
  return (
    <>
      {loading1 ? (
        <Loader />
      ) : isAuthenticated ? (
        user.role === "admin" ? (
          <div className="dashboard">
            <Sidebar />
            <div className="newProductContainer">
              <form
                encType="multipart/form-data"
                className="createProductForm"
                onSubmit={createProductSubmitHandler}
              >
                <h1>Update Product</h1>
                <div>
                  <Spellcheck />
                  <input
                    type="text"
                    placeholder="Product Name  (Upto 50 Characters)"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div>
                  <AttachMoney />
                  <input
                    type="number"
                    placeholder="Price"
                    required
                    value={price ? price : ""}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>
                <div>
                  <Description />
                  <textarea
                    placeholder="Product Description..."
                    value={description}
                    onChange={(e) => {
                      setDescription(e.target.value);
                    }}
                    cols="30"
                    rows="1"
                  ></textarea>
                </div>
                <div>
                  <AccountTree />
                  <select
                    required
                    value={category}
                    onChange={handleCategoryChange}
                  >
                    <option>Choose Category</option>
                    {keysArray.map((cate) => (
                      <option required key={cate} value={cate}>
                        {cate}
                      </option>
                    ))}
                  </select>
                </div>
                {temp ? (
                  <div>
                    <AccountTree />
                    <select
                      value={subcategory}
                      required
                      onChange={(e) => setSubCategory(e.target.value)}
                    >
                      <option required value="">
                        Choose SubCategory
                      </option>
                      {categories.get(category).map((cate) => (
                        <option key={cate} value={cate}>
                          {cate}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <></>
                )}
                <div>
                  <Spellcheck />
                  <input
                    type="text"
                    placeholder="Product Brand (Upto 10 Characters)"
                    required
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                  />
                </div>

                <div>
                  <Storage />
                  <input
                    type="number"
                    placeholder="Stock"
                    value={Stock}
                    required
                    onChange={(e) => setStock(e.target.value)}
                  />
                </div>
                <div className="selectImg">
                  Product Images
                  <p>Select Images orderwise</p>
                </div>
                <div id="createProductFormFile">
                  <input
                    type="file"
                    name="product"
                    accept="image/*"
                    multiple
                    onChange={updateProductImagesChange}
                  />
                </div>
                {imagesPreview.length ? (
                  <div id="createProductFormImage">
                    {imagesPreview.map((image, index) => (
                      <img src={image} key={index} alt="Image Preview" />
                    ))}
                  </div>
                ) : (
                  <></>
                )}
                {oldimages.length ? (
                  <div id="createProductFormImage">
                    {oldimages.map((image, index) => (
                      <img
                        src={image.url}
                        key={index}
                        alt="Old Image Preview"
                      />
                    ))}
                  </div>
                ) : (
                  <></>
                )}
                <Button
                  id="createProductBtn"
                  className="updateProductBtn"
                  type="submit"
                  disabled={loading ? true : false}
                >
                  {loading && <CircularProgress size={20} />}
                  UPDATE
                </Button>
              </form>
              <ToastContainer />
            </div>
          </div>
        ) : (
          <NotAuthorised />
        )
      ) : (
        <NotAuthorised />
      )}
    </>
  );
};

export default UpdateProduct;
