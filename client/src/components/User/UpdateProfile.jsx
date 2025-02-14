import React, { useState, useEffect } from "react";
import "./UpdateProfile.css";
import Loader from "../Loader/Loader";
import { MailOutline, Face, Phone } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, getUser, updateProfile } from "../../actions/userActions";
import { UPDATE_USER_RESET } from "../../constants/userConstants";
import { useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";
//firebase
import { RecaptchaVerifier, signInWithPhoneNumber } from "@firebase/auth";
import { auth } from "../../firebase.config";
import Profile from "../../images/Profile.png";
//toast
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UpdateProfile = () => {
  const dispatch = useDispatch();
  const history = useNavigate();
  const { user } = useSelector((state) => state.user);
  const { error, isUpdated, loading } = useSelector(
    (state) => state.updateUser
  );

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState();
  const [phoneNo, setPhoneNo] = useState(0);
  const [avatarPreview, setAvatarPreview] = useState(Profile);
  const [showOptBox, setShowOtpBox] = useState(false);
  const [sent, setSent] = useState(false);
  const [otp, setOtp] = useState(0);
  const [loading1, setLoading1] = useState(false);
  const updateProfileSubmit = () => {
    onOTPVerify(otp);
  };

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setPhoneNo(user.phoneNo);
    }

    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (isUpdated) {
      toast.success("Profile Updated Successfully");
      dispatch(getUser());

      history("/user/me");

      dispatch({
        type: UPDATE_USER_RESET,
      });
    }
  }, [dispatch, error, history, user, isUpdated]);

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
  // onCaptchVerify();
  const onSignUp = () => {
    setLoading1(true);
    onCaptchVerify();
    const appVerifier = window.recaptchaVerifier;
    const formatPh = `+91${phoneNo}`;
    signInWithPhoneNumber(auth, formatPh, appVerifier)
      .then((confirmationResult) => {
        // SMS sent.
        toast.success("A six Digit Code Sent to your number");
        setLoading1(false);
        setShowOtpBox(true);
        setSent(true);

        window.confirmationResult = confirmationResult;
        // ...
      })
      .catch((error) => {
        setLoading1(false);
        toast.error(
          "There was an error sending the SMS! Try Reloading The Page"
        );
        // ...
      });
  };
  const onOTPVerify = (otp) => {
    setLoading1(true);
    window.confirmationResult
      .confirm(otp)
      .then((result) => {
        // User signed in successfully.

        setLoading1(false);
        toast.success("OTP verifed!");
        const myForm = new FormData();

        myForm.set("name", name);
        if (email !== "") {
          myForm.set("email", email);
        }
        myForm.set("phoneNo", phoneNo);

        toast.success("Profile Updated Successfully!");
        dispatch(updateProfile(myForm));
        history('/user/me');
        // ...
      })
      .catch((error) => {
        // User couldn't sign in (bad verification code?)
        // ...
        setLoading1(false);
        toast.error("Incorrect OTP please try again!");
      });
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="updateProfileContainer">
            <div className="updateProfileBox">
              <h2 className="updateProfileHeading">Update Profile</h2>

              <form className="updateProfileForm" encType="multipart/form-data">
                <div className="updateProfileName">
                  <Face />
                  <input
                    type="text"
                    placeholder="Name"
                    required
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="updateProfileEmail">
                  <MailOutline />
                  <input
                    type="email"
                    placeholder="Email"
                    required
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="updateProfileEmail">
                  <Phone />
                  <input
                    type="Number"
                    placeholder="Number"
                    required
                    name="number"
                    value={phoneNo} 
                    disabled={sent}
                    onChange={(e) => setPhoneNo(e.target.value)}
                  />
                </div>
                {sent ? (
                  <div className="updateProfileEmail">
                    <Phone />
                    <input
                      type="Number"
                      placeholder="Enter 6 Digit Code"
                      required
                      name="number"
                      onChange={(e) => setOtp(e.target.value)}
                    />
                  </div>
                ) : (
                  <></>
                )}

                <button
                  className="updateProfileBtn"
                  type="button"
                  onClick={() => {
                    if (sent) {
                      updateProfileSubmit();
                    } else {
                      onSignUp();
                    }
                  }}
                >
                  {loading1 && (
                    <CircularProgress className="loadingCircle" size={20} />
                  )}
                  {sent ? <>Update</> : <>Get OTP</>}
                </button>
              </form>
            </div>
          </div>
          <div id="recaptcha-container"></div>
          <ToastContainer />
        </>
      )}
    </>
  );
};

export default UpdateProfile;
