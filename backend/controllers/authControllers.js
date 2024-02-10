import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import User from "../modals/user.js";
import ErrorHandler from "../utils/errorHandler.js";

//Inregistrarea utilizatorului => /api/v1/register
export const registerUser = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password } = req.body;

  const user = await User.create({
    name,
    email,
    password,
  });

  const token = user.getJwtToken();

  res.status(201).json({
    token,
  });
});

//Logarea utilizatorului => /api/v1/register
export const loginUser = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Please enter email and password", 400));
  }

  //Cauta userul in baza de date
  const user = await User.findOne({email}).select("+password");

  if (!user) {
    return next(new ErrorHandler("Inavalid email or password", 401));
  }

  //Verificam daca parola introdusa este corecta
  const isPasswordMatched = await user.comparePassword(password)
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Inavalid email or password", 401));
  }

  const token = user.getJwtToken();

  res.status(200).json({
    token,
  });
});
