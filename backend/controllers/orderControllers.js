import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import Order from "../modals/order.js";
import ErrorHandler from "../utils/errorHandler.js";
import Product from "../modals/product.js";

//Cream o noua comanda => /api/v1/orders/new

export const newOrder = catchAsyncErrors(async (req, res, next) => {
  const {
    orderItems,
    shippingInfo,
    itemsPrice,
    taxAmount,
    shippingAmount,
    totalAmount,
    paymentMethod,
    paymentInfo,
  } = req.body;

  const order = await Order.create({
    orderItems,
    shippingInfo,
    itemsPrice,
    taxAmount,
    shippingAmount,
    totalAmount,
    paymentMethod,
    paymentInfo,
    user: req.user._id,
  });

  res.status(200).json({
    order,
  });
});

//Accesam comenzile utilizatorului actual => /api/v1/me/orders

export const myOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id });

  res.status(200).json({
    orders,
  });
});

//Accesam detaliile comenzii => /api/v1/orders/:id .... inclusiv numele si emailul care ne va trebui la frontend.
export const getOrderDetails = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (!order) {
    return next(new ErrorHandler("No order found with this ID", 404));
  }

  res.status(200).json({
    order,
  });
});

//Accesam toate comenzile => /api/v1/admin/orders

export const allOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find();

  res.status(200).json({
    orders,
  });
});

//Schimba statul comenzii => /api/v1/admin/orders/:id
export const updateOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler("No order found with this ID", 404));
  }

  if (order.orderStatus === "Delivered") {
    return next(new ErrorHandler("You have already delivered this order", 400));
  }

  //Schimba stocul produsui
  order?.orderItems?.forEach(async (item) => {
    const product = await Product.findById(item?.product?.toString());

    if (!product) {
      return next(new ErrorHandler("No product found with this ID", 404));
    }

    product.stock = product.stock - item.quantity;
    await product.save({ validateBeforeSave: false });
  });

  order.orderStatus = req.body.status;
  order.deliveredAt = Date.now();

  await order.save();

  res.status(200).json({
    succes: true,
  });
});

//Stergem comanda => /api/v1/admin/orders/:id
export const deleteOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (!order) {
    return next(new ErrorHandler("No order found with this ID", 404));
  }

  await order.deleteOne();
  res.status(200).json({
    succes: true,
  });
});
