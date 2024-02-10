//Creez token si il salvez in cookie

export default (user, statusCode, res) => {
  // Creez JWT Token
  const token = user.getJwtToken();

  //Optiuni pentru cookie
  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRES_TIME * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  res.status(statusCode).cookie("token", token, options).json({ token });
};
