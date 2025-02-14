import React, { useEffect, useState } from "react";
import "./SignIn.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  checkUser,
  clearErrors,
  login,
  register,
  sendOTP,
} from "../../actions/userActions";
import { RecaptchaVerifier, signInWithPhoneNumber } from "@firebase/auth";
import { auth } from "../../firebase.config";
import Register from "./SignUp/Register";
import Login from "./Login/Login";
import Loader from "../Loader/Loader";

//toast
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CircularProgress } from "@mui/material";

const SignIn = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const history = useNavigate();
  const { loading, isUser, error, isAuthenticated } = useSelector(
    (state) => state.user
  );
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpDisable, setOtpDisable] = useState(true);
  const [userData, setUserData] = useState({});
  const [clicked, setClicked] = useState(false);
  const [loading1, setLoading1] = useState(false);
  const handleInputChange = (event) => {
    setOtpDisable(phoneNumber.length < 10);
    setPhoneNumber(event.target.value);
  };
  const clickFun = (val) => {
    console.log(val);
    setClicked(val);
  };
  const onCaptchVerify = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible",
          callback: (response) => {
            // reCAPTCHA solved, allow signInWithPhoneNumber.
            // ...
          },
          "expired-callback": () => {
            toast.error("reCAPTCHA Expired! Please Try Again");
          },
        },
        auth
      );
    }
  };
  const onSignUp = () => {
    setLoading1(true);
    onCaptchVerify();
    const appVerifier = window.recaptchaVerifier;
    const formatPh = `+91${phoneNumber}`;
    signInWithPhoneNumber(auth, formatPh, appVerifier)
      .then((confirmationResult) => {
        // SMS sent.
        setLoading1(false);
        setClicked(true);
        dispatch(checkUser(phoneNumber));
        window.confirmationResult = confirmationResult;
        // ...
      })
      .catch((error) => {
        setLoading1(false);
        toast.error("There was an error sending the SMS! Try Reloading The Page");
        // ...
      });
  };
  const onOTPVerify = (otp) => {
    setLoading1(true);
    console.log(otp);
    window.confirmationResult
      .confirm(otp)
      .then((result) => {
        // User signed in successfully.
        isUser ? dispatch(login(phoneNumber)) : dispatch(register(userData));
        setLoading1(false);
        toast.success('OTP verifed!')
        // ...
      })
      .catch((error) => {
        // User couldn't sign in (bad verification code?)
        // ...
        setLoading1(false);
        toast.error("Incorrect OTP please try again!");
      });
  };
  console.log(location.search.split("=")[1]);
  let redirect = location.search ? location.search.split("=")[1] : "/";

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
    if (isAuthenticated) {
      if (redirect === "shipping") {
        redirect = "/shipping";
      }
      history(redirect);
    }
  }, [dispatch, error, toast, history, isAuthenticated]);

  return (
    <>
      <div className="container">
        <h1>Welcome To Grocery</h1>
        {clicked ? (
          loading ? (
            <Loader />
          ) : isUser ? (
            <Login
              phoneNo={phoneNumber}
              onOTPVerify={onOTPVerify}
              clickFun={clickFun}
              loading1={loading1}
              onSignUp={onSignUp}
            />
          ) : (
            <Register
              phoneNo={phoneNumber}
              clickFun={clickFun}
              onOTPVerify={onOTPVerify}
              setUserData={setUserData}
              loading1={loading1}
              onSignUp={onSignUp}
            />
          )
        ) : (
          <div className="auth-container">
            <h1>Sign In to Grocery</h1>
            <p>To access your addresses and Orders</p>
            <div className="phoneNumber">
              <p>+91</p>
              <input
                type="text"
                placeholder="Enter Your Mobile Number"
                onChange={handleInputChange}
              />
            </div>
            <hr />
            <button disabled={loading1} onClick={onSignUp} className="submit" >
              {loading1 && <CircularProgress size={18} />}
              {loading1===false && <>Get OTP</>}
            </button>
          </div>
        )}

        <div id="recaptcha-container"></div>
        <ToastContainer />
      </div>
    </>
  );
};

export default SignIn;
