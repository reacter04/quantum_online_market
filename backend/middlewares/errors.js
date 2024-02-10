import ErrorHandler from "../utils/errorHandler.js";

export default (err, req, res, next) => {
  let error = {
    statusCode: err?.statusCode || 500,
    message: err?.message || "Internal Server Error",
  };

  //Gestionez eroarea id-ului mongoose invalid
  if(err.name === "CastError"){
    const message = `Resource nou found. Invalid: ${err.path}`
    error = new ErrorHandler(message, 404)
  }

 //Gestionez eroare de validare la adaugarea unui produs 
  if(err.name === "ValidationError"){
    const message = Object.values(err.errors).map(value => value.message)
    error = new ErrorHandler(message, 400)
  }

  if (process.env.NODE_ENV === "DEVELOPMENT") {
    res.status(error.statusCode).json({
      message: error.message,
      error: err,
      stack: err?.stack
    });
  }
  if (process.env.NODE_ENV === "PRODUCTION") {
    res.status(error.statusCode).json({
      message: error.message,
    });
  }
};
