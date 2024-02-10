import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import Product from "../modals/product.js";
import APIFilters from "../utils/apiFilters.js";
import ErrorHandler from "../utils/errorHandler.js";

//Crearea unui nou Produs => /api/v1/products
export const getProducts = catchAsyncErrors(async (req, res) => {
  const resPerPage = 4;
  const apiFilters = new APIFilters(Product, req.query).search().filters();
  let products = await apiFilters.query;
  let filteredProductsCount = products.length;

  apiFilters.pagination(resPerPage);
  products = await apiFilters.query.clone();

  res.status(200).json({ resPerPage, filteredProductsCount, products });
});

//Crearea unui nou Produs => /api/v1/admin/products
export const newProduct = catchAsyncErrors(async (req, res) => {
  const product = await Product.create(req.body);
  res.status(200).json({ product });
});

//Obtine detaliile unui produs => /api/v1/admin/products/:id
export const getProductDetails = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req?.params?.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }
  res.status(200).json({ product });
});

//Actualizarea detaliilor produsului => /api/v1/admin/products/:id
export const updateProduct = catchAsyncErrors(async (req, res) => {
  let product = await Product.findById(req?.params?.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }
  product = await Product.findByIdAndUpdate(req?.params?.id, req.body, {
    new: true,
  });

  res.status(200).json({ product });
});

//Stergerea detaliilor produsului => /api/v1/admin/products/:id
export const deleteProduct = catchAsyncErrors(async (req, res) => {
  const product = await Product.findById(req?.params?.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }
  await product.deleteOne();

  res.status(200).json({ message: "Produsul  a fost sters" });
});
