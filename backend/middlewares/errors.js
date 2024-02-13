import ErrorHandler from "../utils/errorHandler.js";

export default (err, req, res, next) => {
  let error = {
    statusCode: err?.statusCode || 500,
    message: err?.message || "Internal Server Error",
  };

  //Gestionez eroarea id-ului mongoose invalid
  if (err.name === "CastError") {
    const message = `Resource nou found. Invalid: ${err.path}`;
    error = new ErrorHandler(message, 404);
  }

  //Gestionez eroare de validare la adaugarea unui produs
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map((value) => value.message);
    error = new ErrorHandler(message, 400);
  }

  //Gestionez eroara "key dublicate" pentru situatiile cand emailul este acelasi la inregistrare
  if (err.code === 11000) {
    const message = `Dublicate ${Object.keys(err.keyValue)} entered`;
    error = new ErrorHandler(message, 400);
  }

  //Gestionez eroarea tokenului JWT gresit
  if (err.name === "JsonWebTokenError") {
    const message = `JSON Web Token is invalid. Try again!!!`;
    error = new ErrorHandler(message, 400);
  }

    //Gestionez eroarea tokenului JWT expirat
    if (err.name === "TokenExpired") {
      const message = `JSON Web Token is expired. Try again!!!`;
      error = new ErrorHandler(message, 400);
    }
  

  if (process.env.NODE_ENV === "DEVELOPMENT") {
    res.status(error.statusCode).json({
      message: error.message,
      error: err,
      stack: err?.stack,
    });
  }
  if (process.env.NODE_ENV === "PRODUCTION") {
    res.status(error.statusCode).json({
      message: error.message,
    });
  }
};
