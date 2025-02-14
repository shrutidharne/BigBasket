import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, Navigate, useNavigate } from "react-router-dom";
import Loader from "../Loader/Loader";
import { State } from "country-state-city";
import { Typography } from "@mui/material";
import "./Shipping.css";
import CheckOutSteps from "./CheckOutSteps";

import {
  PinDrop,
  Home,
  LocationCity,
  Public,
  Phone,
  TransferWithinAStation,
} from "@mui/icons-material";

//toast
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { clearErrors } from "../../actions/productActions";
import NotAuthorised from "../Error/NotAuthorised";
import { saveShippingInfo } from "../../actions/cartActions";

const Shipping = () => {
  const dispatch = useDispatch();
  const { loading, isAuthenticated, error,user } = useSelector(
    (state) => state.user
  );
  const { shippingInfo } = useSelector((state) => state.cart);
  const [address, setAddress] = useState(shippingInfo.address);
  const [city, setCity] = useState(shippingInfo.city);
  const [state, setState] = useState(shippingInfo.state);
  const [pinCode, setPinCode] = useState(shippingInfo.pinCode);
  const [phoneNo, setPhoneNo] = useState(shippingInfo.phoneNo);
  const history = useNavigate();
  useEffect(()=>{
    if(isAuthenticated){
      if(user.shippingAddress){
        setAddress(user.shippingAddress.address);
        setCity(user.shippingAddress.city);
        setPinCode(user.shippingAddress.pinCode);
        setPhoneNo(user.shippingAddress.phoneNo);
        setState(user.shippingAddress.state);
      }
    } 
},[isAuthenticated])
  const shippingSubmit = (e) => {
    e.preventDefault();
    if (phoneNo.length < 10 || phoneNo.length > 10) {
      toast.error("Phone Number should be 10 digits");
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
    history("/order/confirm");
  };
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
  }, [dispatch, error]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : isAuthenticated ? (
        <>
          <CheckOutSteps className="steps" activeSteps={0} />
          <div className="shippingContainer">
            <div className="shippingBox">
              <h2 className="shippingHeading">Shipping Details</h2>
              <form
                className="shippingForm"
                encType="multipart/form-data"
                onSubmit={shippingSubmit}
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

                <input
                  type="submit"
                  value="Continue"
                  className="shippingBtn"
                  disabled={state ? false : true}
                />
              </form>
            </div>
          </div>
        </>
      ) : (
        <NotAuthorised />
      )}
      <ToastContainer />
    </>
  );
};

export default Shipping;
