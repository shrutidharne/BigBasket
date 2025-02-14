const sendCookie = (user, statusCode, res) => {
  //Generating JWTTOKEN
  const token = user.getJWTToken();
  const options = {
    httpOnly: true,
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
  };
  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    token,
    user,
  });
};
export default sendCookie;
