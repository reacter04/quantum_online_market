import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import User from "../modals/user.js";
import ErrorHandler from "../utils/errorHandler.js";
import sendToken from "../utils/sendToken.js";

//Inregistrarea utilizatorului => /api/v1/register
export const registerUser = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password } = req.body;

  const user = await User.create({
    name,
    email,
    password,
  });

  const token = user.getJwtToken();

  sendToken(user, 201, res);
});
//Logarea utilizatorului => /api/v1/register
export const loginUser = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Please enter email and password", 400));
  }

  //Cauta userul in baza de date
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Inavalid email or password", 401));
  }

  //Verificam daca parola introdusa este corecta
  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Inavalid email or password", 401));
  }

  sendToken(user, 200, res);
});

//Delogarea utilizatourului => /api/v1/logout
export const logout = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    message: "Logged Out",
  })
});
