import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import User from "../modals/user.js";
import { getResetPasswordTemplate } from "../utils/emailTemplates.js";
import ErrorHandler from "../utils/errorHandler.js";
import sendEmail from "../utils/sendEmail.js";
import sendToken from "../utils/sendToken.js";
import crypto from "crypto";

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
  });
});

// Ai uitat parola => /api/v1/password/forgot
export const forgotPassword = catchAsyncErrors(async (req, res, next) => {
  //Cauta userul in baza de date
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler("User not found with this email", 404));
  }

  //Obitinem resetarea tokenului pentru resetarea parolei
  const resetToken = await user.getResetPasswordToken();
  await user.save();

  //Creem url-ul pentru resetarea parolei
  const resetUrl = `${process.env.FRONTEND_URL}/api/v1/password/reset/${resetToken}`;

  const message = getResetPasswordTemplate(user?.name, resetUrl);

  try {
    await sendEmail({
      email: user.email,
      subject: "Quantum Password Recovery",
      message,
    });

    res.status(200).json({
      message: `Email sent to: ${user.email}`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();
    return next(new ErrorHandler(error?.message, 500));
  }
});

// Resetam parola => /api/v1/reset/token
export const resetPassword = catchAsyncErrors(async (req, res, next) => {
  //Verificam tokenul URL
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHandler(
        "Password reset token is invalid or has been expired",
        404
      )
    );
  }
  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password does not match", 404));
  }
  //Setam noua parola
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendToken(user, 200, res);
});

// Obtine profilul actual al userului => /api/v1/me
export const getUserProfile = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req?.user?._id);
  res.status(200).json({
    user,
  });
});

// Schibam parola  => /api/v1/password/update
export const updatePassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req?.user?._id).select("+password");

  //Verific daca parola anterioara daca este acceasi cu cea introdusa
  const isPasswordMatced = await user.comparePassword(req.body.oldPassword);

  if (!isPasswordMatced) {
    return next(new ErrorHandler("Old Password is incorrect", 400));
  }
  user.password = req.body.password;
  user.save();

  res.status(200).json({
    succes: true,
  });
});

// Schibam userul (numele si emailul)  => /api/v1/me/update
export const updateProfile = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  };

  const user = await User.findByIdAndUpdate(req.user._id, newUserData, {
    new: true,
  });

  res.status(200).json({
    user,
  });
});

// Obtinem lista cu toti userii - ADMIN  => /api/v1/admin/users
export const allUsers = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    users,
  });
});

// Obtinem detaliile userului - ADMIN  => /api/v1/admin/users/:id
export const getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHandler(`Not found user with id: ${req.params._id}`, 404)
    );
  }

  res.status(200).json({
    user,
  });
});

// Schibam detaliile userulului (ADMIN)  => /api/v1/admin/users/:id
export const updateUser = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };

  const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
  });

  res.status(200).json({
    user,
  });
});

// Stergem userul - ADMIN  => /api/v1/admin/users/:id
export const deleteUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHandler(`Not found user with id: ${req.params.id}`, 404)
    );
  }

  //DE STERS POZA DE PE AVATAR DE PE CLOUDINARY (mai tarziu revin)
  await user.deleteOne();

  res.status(200).json({
    succes: true,
  });
});
