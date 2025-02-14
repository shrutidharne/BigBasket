import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Login.css";
import OtpInput from "react-otp-input";
import { CircularProgress } from "@mui/material";
const Login = ({ phoneNo, onOTPVerify, clickFun, loading1, onSignUp }) => {
  const [resendTimer, setResendTimer] = useState(30);
  const [otp, setOtp] = useState(0);
  const handleSubmit = (e) => {
    e.preventDefault();
    onOTPVerify(otp);
  };
  useEffect(() => {
    let intervalId;

    if (resendTimer > 0) {
      intervalId = setInterval(() => {
        setResendTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [resendTimer]);
  return (
    <>
      <div className="auth-container2">
        <h2>Verify Phone Number</h2>
        <p>An SMS with 6-digit OTP was sent to</p>
        <span className="phoneNO">
          {`+91 ${phoneNo}`} <Link onClick={() => clickFun(false)}>Change</Link>
        </span>
        <OtpInput
          containerStyle="otpInput"
          value={otp}
          onChange={setOtp}
          inputType='number'
          numInputs={6}
          renderInput={(props) => <input {...props} />}
        />
        <hr className="lastHR" />
        <div>
          <p>Did not recivied OTP?</p>
          <button disabled={resendTimer || loading1} onClick={onSignUp}>
            Resend({`${resendTimer}s`})
          </button>
        </div>
        <button className="submit1" onClick={handleSubmit}>
          {loading1 && <CircularProgress size={20} />}
          {!loading1 && <>Get Started</>}
        </button>
      </div>
    </>
  );
};

export default Login;
