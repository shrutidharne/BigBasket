import React, { useEffect, useState } from "react";
import "./newProduct.css";
import { Button } from "@mui/material";
import {
  AccountTree,
  Description,
  Storage,
  Spellcheck,
  AttachMoney,
} from "@mui/icons-material";
import Sidebar from "./Sidebar";
import { NEW_PRODUCT_RESET } from "../../constants/productConstants";
import { CircularProgress } from "@mui/material";

//toast
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useDispatch, useSelector } from "react-redux";
import { clearErrors } from "../../actions/userActions";
import { useNavigate } from "react-router-dom";
import { createProduct, getAdminProduct } from "../../actions/productActions";
import Loader from "../Loader/Loader";
import NotAuthorised from "../Error/NotAuthorised";

const categories = [
  [
    "Staples",
    [
      "Atta Flours & Sooji",
      "Dals & Pulses",
      "Rice & Rice Products",
      "Edible Oils",
      "Masalas & Spcies",
      "Salt, Sugar & Jaggery",
    ],
  ],
  [
    "Dairy & Bakery",
    [
      "Dairy",
      "Toast & Khari",
      "Cakes & Muffinss",
      "Breads and Buns",
      "Baked Cookies",
      "Bakery Snacks",
      "Cheese",
      "Ghee",
      "Paneer & Tofu",
    ],
  ],
  [
    "Snacks",
    [
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
    ],
  ],
  [
    "Beverages",
    [
      "Tea",
        "Coffee",
        "Fruit juices",
        "Energy & Soft Drinks",
        "Health Drink & Supplement",
        "Soda & Flavoured Water",
    ],
  ],
  [
    "Home Care",
    [
      "Detergents",
      "Dishwash",
      "All Purpose Cleaners",
      "Fresheners & Repellents",
      "Shoe Care",
      "Pet Supplies",
    ],
  ],
  ["Kitchen", ["Disposables", "Bottles", "Dishes & Containers", "Tablewares"]],
];
const NewProduct = () => {
  const dispatch = useDispatch();
  const history = useNavigate();
  const { error: error1 } = useSelector((state) => state.products);
  const {
    loading: loading1,
    user,
    isAuthenticated,
  } = useSelector((state) => state.user);
  const { loading, error, success } = useSelector((state) => state.newProduct);
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [Stock, setStock] = useState("");
  const [images, setImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);
  const [index, setIndex] = useState(0);
  const [temp, setTemp] = useState(0);
  document.addEventListener("wheel", function (event) {
    if (document.activeElement.type === "number") {
      document.activeElement.blur();
    }
  });
  useEffect(() => {
    if (error) {
      console.log(error);
      toast.error(error);
      dispatch(clearErrors());
    }
    if (success) {
      toast.success("Product Created Successfully!");
      history("/admin/dashboard");
      dispatch({ type: NEW_PRODUCT_RESET });
    }
  }, [dispatch, error, history, success]);
  useEffect(() => {
    if (error1) {
      toast.error(error1);
    }
  }, [error]);
  useEffect(() => {
    dispatch(getAdminProduct());
  }, [dispatch]);

  const createProductSubmitHandler = (e) => {
    e.preventDefault();
    const myForm = new FormData();
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
    dispatch(createProduct(form));
  };
  const createProductImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages([]);

    setImagesPreview([]);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState == 2) {
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
                <h1>Create Product</h1>
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
                  <select required onChange={handleCategoryChange}>
                    <option value="">Choose Category</option>
                    {categories.map((cate) => (
                      <option key={cate[0]} value={cate[0]}>
                        {cate[0]}
                      </option>
                    ))}
                  </select>
                </div>
                {temp ? (
                  <div>
                    <AccountTree />
                    <select
                      required
                      onChange={(e) => setSubCategory(e.target.value)}
                    >
                      <option value="">Choose SubCategory</option>
                      {categories[index - 1][1].map((cate) => (
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
                    required
                    className="stockInput"
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
                    onChange={createProductImageChange}
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

                <Button
                  id="createProductBtn"
                  type="submit"
                  disabled={loading ? true : false}
                >
                  {loading && <CircularProgress size={20} />}
                  Create
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

export default NewProduct;
