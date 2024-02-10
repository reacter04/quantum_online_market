
//Creez token si il salvez in cookie

export default (user, statusCode, res) => {
  // Creez JWT Token
  const token = user.getJwtToken();

  // Optiuni pentru cookie (o saptamana valabil)

  const currentTime = new Date()
  currentTime.setDate(currentTime.getDate() + 7)
  

  const options = {
    expires: currentTime.toLocaleString(),
    httpOnly: true,
  };
  /*sau asa direct,
new Date(Date.now() + process.env.COOKIE_EXPIRES_TIME * 24 * 60 * 60 * 1000)*/


  res.status(statusCode).cookie("token", token, options).json({ token });
};

