import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../Loader/Loader";
import { Link, useNavigate } from "react-router-dom";
import Profile1 from "../../images/Profile.png";
import "./Profile.css";
import {
  Edit,
  Delete,
  PinDrop,
  Home,
  LocationCity,
  Phone,
  Add,
  TransferWithinAStation,
} from "@mui/icons-material";
import { State } from "country-state-city";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

//toast
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { saveShippingInfo } from "../../actions/cartActions";
import NotAuthorised from "../Error/NotAuthorised";
import { clearErrors, deleteAddress } from "../../actions/userActions";
import { DELETE_USER_RESET } from "../../constants/userConstants";

const Profile = () => {
  const dispatch = useDispatch();
  const { user, loading, isAuthenticated } = useSelector((state) => state.user);
  const { isDeleted, error } = useSelector((state) => state.updateUser);
  const history = useNavigate();
  const { shippingInfo } = useSelector((state) => state.cart);
  const [address, setAddress] = useState(shippingInfo.address);
  const [city, setCity] = useState(shippingInfo.city);
  const [state, setState] = useState(shippingInfo.state);
  const [pinCode, setPinCode] = useState(shippingInfo.pinCode);
  const [phoneNo, setPhoneNo] = useState(shippingInfo.phoneNo);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (loading === false) {
      if (isAuthenticated === false) {
        console.log("not");
        history("/auth/signin");
      }
    }
  }, [isAuthenticated, loading]);
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
    if (isDeleted) {
      toast.success("Deleted!");
      dispatch({ type: DELETE_USER_RESET });
    }
  }, [isDeleted, error]);
  useEffect(() => {
    if (shippingInfo) {
      setAddress(shippingInfo.address);
      setCity(shippingInfo.city);
      setState(shippingInfo.state);
      setPinCode(shippingInfo.pinCode);
      setPhoneNo(shippingInfo.phoneNo);
    }
  }, [shippingInfo]);
  useEffect(() => {
    if (isAuthenticated) {
      setAddress(user.shippingAddress.address);
      setCity(user.shippingAddress.city);
      setState(user.shippingAddress.state);
      setPinCode(user.shippingAddress.pinCode);
      setPhoneNo(user.shippingAddress.phoneNo);
    }
  }, [isAuthenticated]);
  const removeAddress = () => {
    dispatch(deleteAddress());
  };
  const addAddress = (e) => {
    e.preventDefault();
    if (phoneNo.length < 10 || phoneNo.length > 10) {
      toast.error("Phone Number should be 10 digits");
      return;
    }
    if (pinCode.toString().length !== 6) {
      toast.error(`Invalid Pincode`);
      return;
    }
    dispatch(
      saveShippingInfo({
        address,
        city,
        state,
        country: "India",
        pinCode: parseInt(pinCode),
        phoneNo: parseInt(phoneNo),
      })
    );
    setOpen(false);
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : isAuthenticated ? (
        <>
          <div className="profileContainer">
            <div>
              <h1>My Profile</h1>
              <img
                className="profileImg"
                src={Profile1}
                alt={user && user.name}
              />
              <Link to="/me/update">Edit Profile</Link>
            </div>
            <div>
              <div className="addressInfo">
                <h4>
                  Address{" "}
                  {user && user.shippingAddress ? (
                    <></>
                  ) : (
                    <Button
                      className="addAddressButton"
                      onClick={() => setOpen(true)}
                    >
                      Add Address
                    </Button>
                  )}{" "}
                </h4>
                {user && user.shippingAddress ? (
                  <>
                    <div>
                      {user.shippingAddress ? (
                        <div>
                          <Link onClick={() => setOpen(true)}>
                            <Edit />
                          </Link>
                          <Link onClick={removeAddress}>
                            <Delete />
                          </Link>
                        </div>
                      ) : (
                        <></>
                      )}
                    </div>
                    <br />
                    <p>{address}</p>
                    <p>State: {state}</p>
                    <p>City: {city}</p>
                    <p>PINCODE: {pinCode}</p>
                    <p>Phone Number: +91 {phoneNo}</p>
                  </>
                ) : (
                  <></>
                )}
              </div>
              <div>
                <h4>Full Name</h4>
                <p>{user.name}</p>
              </div>
              <div>
                <h4>Phone Number</h4>
                <p>{user.phoneNo}</p>
              </div>
              <div>
                <h4>Email</h4>
                <p>{user.email}</p>
              </div>

              <div>
                <Link to="/my/orders">My Orders</Link>
              </div>
            </div>
          </div>
          <Dialog
            aria-aria-labelledby="simple-dialog-title"
            open={open}
            onClose={() => {
              setOpen(!open);
            }}
          >
            <DialogTitle>
              {user.shippingAddress ? `Edit Address` : `Add Address`}
            </DialogTitle>
            <DialogContent>
              <div className="shippingContainer">
                <div className="shippingBox1">
                  <form
                    className="shippingForm1"
                    encType="multipart/form-data"
                    onSubmit={addAddress}
                  >
                    <div>
                      <Home />
                      <input
                        type="text"
                        placeholder="Address"
                        required
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                      />
                    </div>
                    <div>
                      <LocationCity />
                      <input
                        type="text"
                        placeholder="City"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                      />
                    </div>
                    <div>
                      <PinDrop />
                      <input
                        type="number"
                        placeholder="Pin"
                        required
                        value={pinCode}
                        onChange={(e) => setPinCode(e.target.value)}
                      />
                    </div>
                    <div>
                      <Phone />
                      <input
                        type="number"
                        placeholder="phone"
                        required
                        value={phoneNo}
                        onChange={(e) => setPhoneNo(e.target.value)}
                      />
                    </div>
                    <div className="stateDiv">
                      <TransferWithinAStation />
                      <select
                        required
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                      >
                        <option>State</option>
                        {State &&
                          State.getStatesOfCountry("IN").map((item) => (
                            <option key={item.isoCode} value={item.isoCode}>
                              {item.name}
                            </option>
                          ))}
                      </select>
                    </div>

                    <DialogActions>
                      <Button
                        onClick={() => {
                          setOpen(!open);
                        }}
                        color="secondary"
                      >
                        Cancel
                      </Button>
                      <Button type="submit" disabled={state ? false : true}>
                        Submit
                      </Button>
                    </DialogActions>
                  </form>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <ToastContainer />
        </>
      ) : (
        <NotAuthorised />
      )}
      <ToastContainer />
    </>
  );
};

export default Profile;
