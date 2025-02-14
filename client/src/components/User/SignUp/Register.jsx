import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './Register.css'
import OtpInput from 'react-otp-input';
import { CircularProgress } from '@mui/material';

const Register = ({ phoneNo, onOTPVerify, clickFun,setUserData,loading1,onSignUp }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState('');
  const [resendTimer, setResendTimer] = useState(30);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(otp);
    let myForm = email === "" ? {
      name,
      phoneNo,
      otp
    } :
      {
        name,
        email,
        phoneNo,
        otp
      };
    setUserData(myForm);
    onOTPVerify(otp);
  }
  useEffect(() => {
    let intervalId;

    if (resendTimer > 0) {
      intervalId = setInterval(() => {
        setResendTimer(prevTimer => prevTimer - 1);
      }, 1000);
    }

    return () => {

      clearInterval(intervalId);
    };
  }, [resendTimer]);
  return (
    <>
      <div className="auth-container1">
        <h1>Register to Grocery</h1>
        <p>Please enter your details for a better shopping experience</p>
        <form >
          <div className="field-holder">
            <input type="text" id='name' required autofocus onChange={(e) => { setName(e.target.value) }} />
            <label htmlFor="name" className='floating-label'>Enter Your Name *</label>
          </div>
          <hr />
          <div className="field-holder">
            <input type="text" id='email' required autofocus onChange={(e) => { setEmail(e.target.value) }} />
            <label htmlFor="email" className='floating-label'>{'Enter Your Email (optional)'}</label>
          </div>
          <hr />
        </form>
        <h2>Verify Phone Number</h2>
        <p>An SMS with 6-digit OTP was sent to</p>
        <span className='phoneNO'>{`+91 ${phoneNo}`} <Link onClick={() => { clickFun(false) }}>Change</Link></span>
        <OtpInput containerStyle='otpInput' value={otp} onChange={setOtp} numInputs={6} inputType='number' renderInput={(props) => <input {...props} />} />
        <hr className='lastHR' />
        <div className='resendOtp'>
          <p>Did not recivied OTP?</p>
          <button disabled={resendTimer || loading1} onClick={onSignUp}>Resend({`${resendTimer}s`})</button>
          </div>
        <button className="submit1"  onClick={handleSubmit}>
        { loading1 && <CircularProgress size={20}/>}
        {!loading1 && <>Get Started</>}
        </button>
      </div>
    </>
  )
}

export default Register
