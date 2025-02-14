import React, { useEffect, useRef, useState } from "react";
import "./Header.css";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../Loader/Loader";
import { addPinCode, getPin, getUser, logout } from "../../actions/userActions";
import { Drawer, IconButton, Divider, Box, Typography, Skeleton } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import MenuIcon from "@mui/icons-material/Menu";
import { Backdrop } from "@mui/material";
import { CircularProgress } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { TreeItem, TreeView } from "@mui/lab";
import { Done } from "@mui/icons-material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import InventoryIcon from '@mui/icons-material/Inventory';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';

//Images
import staples from "../../images/staples.ico";
import dairy from "../../images/dairy.ico";
import beverages from "../../images/beverages.ico";
import kitchen from "../../images/kitchen.ico";
import snacks from "../../images/snacks.ico";
import homeCare from "../../images/homeCare.ico";
import { getItems } from "../../actions/cartActions";

const Header = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const history = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const { loading: loading1, cartItems } = useSelector((state) => state.cart);
  const [keyword, setKeyword] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const [showBackdrop, setShowBackdrop] = useState(false);
  const [nodeId, setNodeId] = useState(0);
  const dropDownRef = useRef();
  const profileRef = useRef();
  const setdropDownRef = (node) => {
    dropDownRef.current = node;
  };
  const setprofileRef = (node) => {
    profileRef.current = node;
  };

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
    [
      "Kitchen",
      ["Disposables", "Bottles", "Dishes & Containers", "Tablewares"],
    ],
  ];
  const drawerImages = [staples, dairy, snacks, beverages, homeCare, kitchen];
  const { pinCode, loading } = useSelector((state) => state.pinCode);
  const [invalid, setInvalid] = useState(false);
  const [pincode, setPinCode] = useState(0);
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getItems());
    }
  }, [dispatch, isAuthenticated, cartItems]);
  useEffect(() => {
    if (!isAuthenticated) {
      dispatch(getUser());
    }
    dispatch(getPin());
  }, [dispatch, isAuthenticated]);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };
  const handleLogout = () => {
    setProfileOpen(false);
    dispatch(logout());
  };
  const searchSubmitHandler = (e) => {
    // e.preventDefault();
    if (keyword.trim()) {
      history(`/products/${keyword}`);
    } else {
      history("/products");
    }
  };
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      searchSubmitHandler();
    }
  };

  const handleCategory = (category) => {
    history(`/products/&category=${category}`);
  };
  useEffect(() => {
    const body = document.querySelector("body");
    if (showBackdrop) {
      body.style.overflow = "hidden";
    } else {
      body.style.overflow = "auto";
    }
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropDownRef.current &&
        profileRef.current &&
        !profileRef.current.contains(event.target) &&
        !dropDownRef.current.contains(event.target)
      ) {
        setProfileOpen(false);
      } else if (
        profileOpen &&
        profileRef.current &&
        profileRef.current.contains(event.target)
      ) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);
  const handlePinSubmit = (e) => {
    setInvalid(false);
    if (pincode.toString().length === 6) {
      dispatch(addPinCode(pincode));
    } else {
      setInvalid(true);
    }
  };
  useEffect(() => {
    setPinCode(pinCode);
  }, [pinCode]);
  return (
    <>
      <nav>
        <div className="nav-header">
          <div className="headerFirstChild">
            <div className="ham">
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="logo"
                onClick={toggleDrawer}
              >
                <MenuIcon />
              </IconButton>
              <Drawer
                anchor="left"
                open={isDrawerOpen}
                onClose={toggleDrawer}
                className="drawer"
              >
                <Box
                  p={2}
                  width="300px"
                  textAlign="center"
                  role="presentation"
                  className="ham-content"
                >
                  <Typography component="div" className="drawer-header">
                    <div className="toggleIcon">
                      <IconButton size="large" onClick={toggleDrawer}>
                        {isDrawerOpen ? (
                          <ChevronLeftIcon className="svg_icons" />
                        ) : (
                          <ChevronRightIcon className="svg_icons" />
                        )}
                      </IconButton>
                    </div>
                    <h2>Hello!</h2>
                    {isAuthenticated ? (
                      <Link className="signInButton" onClick={handleLogout}>
                        <p>Log Out</p>
                      </Link>
                    ) : (
                      <Link
                        className="signInButton"
                        onClick={toggleDrawer}
                        to={"/auth/signin"}
                      >
                        <p>Sign In</p>
                      </Link>
                    )}
                  </Typography>
                  <Divider />
                  <div className="categoryTree">
                    <Typography className="ham-body">
                      <div>
                        <h3>ALL CATEGORIES</h3>
                      </div>
                    </Typography>
                    <Divider />
                    <TreeView
                      aria-label="file system navigator"
                      defaultCollapseIcon={<ExpandMoreIcon />}
                      defaultExpandIcon={<ChevronRightIcon />}
                    >
                      {categories.map((category, index) => (
                        <>
                          <TreeItem
                            nodeId={index + 1}
                            label={
                              <div className="treeParent">
                                <img src={drawerImages[index]} alt="Staple" />
                                {category[0]}
                              </div>
                            }
                          >
                            {category[1].map((cate, i) => (
                              <>
                                <Link
                                  to={`/products/&subCategory=${cate}`}
                                  onClick={toggleDrawer}
                                >
                                  <TreeItem
                                    className="treeElement"
                                    nodeId={`${index + 1}-${i + 1}`}
                                    label={
                                      <div className="treeItemDiv">
                                        <p>{cate}</p>
                                        <ChevronRightIcon />
                                      </div>
                                    }
                                  />
                                </Link>
                                <Divider />
                              </>
                            ))}
                          </TreeItem>
                          <Divider />
                        </>
                      ))}
                    </TreeView>
                  </div>
                  <Typography component="div" className="ham-body">
                    <Divider sx={{ borderColor: "black" }} />
                    <div>
                      <h3>My account</h3>
                      <Link className="link" to={"/"} onClick={toggleDrawer}>
                        <p>Home</p>
                      </Link>
                      <Divider />
                      <Link
                        className="link"
                        to={"/user/me"}
                        onClick={toggleDrawer}
                      >
                        <p>Profile</p>
                      </Link>
                      <Divider />
                      <Link
                        to={"/my/orders"}
                        className="link"
                        onClick={toggleDrawer}
                      >
                        <p>Orders</p>
                      </Link>
                      <Divider />
                      <Link
                        className="link"
                        to={"/shopping-cart"}
                        onClick={toggleDrawer}
                      >
                        <p>Cart</p>
                      </Link>
                      <Divider />
                      {user && user.role === "admin" ? (
                        <>
                          <Link
                            className="link"
                            onClick={() => {
                              setProfileOpen(false);
                              toggleDrawer();
                            }}
                            to={"/admin/dashboard"}
                          >
                            <p>DashBoard</p>
                          </Link>
                        </>
                      ) : (
                        <></>
                      )}
                      <Divider />
                    </div>
                    <div>
                      <h3>Help and Support</h3>
                      <Link onClick={toggleDrawer} className="link">
                        <p>Contact Us</p>
                      </Link>
                      <Divider />
                      <Link onClick={toggleDrawer} className="link">
                        <p>About Us</p>
                      </Link>
                      <Divider />
                    </div>
                  </Typography>

                  <Typography component="div" className="ham-footer">
                    <div>
                      <h2>LOGO</h2>
                      <p>
                        Please note that you are accessing the BETA Version of
                        grocery.com
                      </p>
                      <p>
                        If you encounter any bugs, glitches, lack of
                        functionality, delayed deliveries, billing errors or
                        other problems on the beta website, please email us on
                        email@logo.com
                      </p>
                      © ecommerce.com 2023
                    </div>
                  </Typography>
                </Box>
              </Drawer>
            </div>

            <Link className="logo" to={"/"}>
              {" "}
              <h1>LOGO</h1>
            </Link>
          </div>
          <div className="searchIcon">
            <input
              type="text"
              placeholder="Search"
              onKeyDown={handleKeyPress}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <SearchIcon />
          </div>
          <div className="navDiv">
            {loading ? (
              <>
                <Skeleton animation={'wave'} className="deliverToDivSkeleton" width={'7vw'} height={'80%'} />
              </>
            ) : (
              <div className="deliverToDiv">
                <LocationOnIcon />
                <Link className="deliverTo">
                  <p>
                    {`Deliver to:-`}
                    <br />
                    {pinCode ? (
                      <>
                        <p>{pinCode}</p>{" "}
                      </>
                    ) : (
                      <>{"Add Pincode"}</>
                    )}
                  </p>
                </Link>
              </div>
            )}

            <div className="pincodeWrap">
              <div className="pincodeDropdown">
                <div>
                  <h3>Where do you want your Delivery?</h3>
                  <p>Enter Your Pincode:</p>
                  <div>
                    <input
                      type="text"
                      onKeyDown={(e) =>
                        e.key === "Enter" ? handlePinSubmit() : null
                      }
                      value={pincode ? pincode : null}
                      onChange={(e) => setPinCode(e.target.value)}
                    />
                    <button onClick={handlePinSubmit}>
                      <Done />
                    </button>
                  </div>
                  {invalid ? <h6>Enter A Valid PinCode!</h6> : <></>}
                </div>
              </div>
            </div>

            {loading1 ? (
              <CircularProgress size={20} />
            ) : (
              <Link className="cartIcon" to={"/shopping-cart"}>
                <ShoppingCartIcon />
                {cartItems && cartItems.length ? (
                  <p>{cartItems.length}</p>
                ) : (
                  <></>
                )}
              </Link>
            )}
            {isAuthenticated ? (
              <>
                <Link
                  ref={setprofileRef}
                  className="helloBox"
                  onClick={() => {
                    setProfileOpen(!profileOpen);
                  }}
                >{`Hi, ${user.name.split(" ")[0]}`}</Link>
                <Backdrop
                  sx={{
                    color: "#fff",
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                  }}
                  open={profileOpen}
                  onClick={() => setProfileOpen(false)}
                />
                {profileOpen ? (
                  <>
                    <div ref={setdropDownRef} className="profileDropDown">
                      <Link
                        onClick={() => {
                          setProfileOpen(false);
                        }}
                        to={"/user/me"}
                      >
                        <AccountCircleIcon />
                        Profile
                      </Link>
                      <hr />
                      <Link
                        to={"/my/orders"}
                        onClick={() => {
                          setProfileOpen(false);
                        }}
                      >
                        <InventoryIcon />
                        Orders
                      </Link>
                      <hr />
                      {user.role === "admin" ? (
                        <>
                          <Link
                            onClick={() => {
                              setProfileOpen(false);
                            }}
                            to={"/admin/dashboard"}
                          >
                            <DashboardIcon />
                            DashBoard
                          </Link>
                          <hr />{" "}
                        </>
                      ) : (
                        <></>
                      )}
                      <Link onClick={handleLogout}> <PowerSettingsNewIcon />Logout</Link>
                    </div>{" "}
                  </>
                ) : (
                  <></>
                )}
              </>
            ) : (
              <Link to={"/auth/signin"}>
                <div className="helloBox">
                  <h4>Sign In</h4>
                </div>
              </Link>
            )}
          </div>
        </div>
        <div className="searchBarDiv">
          <div>
            <input
              className="searchBar"
              type="text"
              placeholder="Search"
              onKeyDown={handleKeyPress}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <button onClick={searchSubmitHandler}>
              <SearchIcon />
            </button>
          </div>
        </div>
        <div className="nav-categories">
          <ul>
            {categories.map((category) => (
              <>
                <div
                  key={category[0]}
                  className="category-wrapper"
                  onMouseEnter={() => setShowBackdrop(true)}
                  onMouseLeave={() => setShowBackdrop(false)}
                >
                  <li
                    onClick={() => {
                      handleCategory(category[0]);
                    }}
                  >
                    {category[0]}
                  </li>

                  <div className="dropDown">
                    {category[1].map((subCategory) => (
                      <Link
                        to={`/products/&subCategory=${subCategory}`}
                        className="subCategory-link"
                      >
                        {subCategory}
                      </Link>
                    ))}
                  </div>
                </div>
              </>
            ))}
          </ul>
          <div className={`${showBackdrop ? "show" : ""}`}></div>
        </div>
      </nav>
    </>
  );
};

export default Header;
