import express from "express";
const app = express();
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connectDatabase } from "./config/dbConnect.js";
import errorMiddleware from "./middlewares/errors.js";


//Gestionez exceptiile necapturate
process.on("uncaughtException", (err) => {
  console.log(`ERROR: ${err}`);
  console.log("Shutting down due to uncaught exception");
  process.exit(1);
});

dotenv.config({ path: "backend/config/config.env" });

//Ne conectam la baza de date
connectDatabase();
app.use(express.json());
app.use(cookieParser());

//Importam toate rutele
import productRoutes from "./routes/products.js";
import authRoutes from "./routes/auth.js";

app.use("/api/v1", productRoutes);
app.use("/api/v1", authRoutes);

//Folosim middlewareul de gestionare a erorilor
app.use(errorMiddleware);

const server = app.listen(process.env.PORT, () => {
  console.log(
    `Server start on PORT ${process.env.PORT} in ${process.env.NODE_ENV} mode`
  );
});

//Gestionam promisunile resinse negestionate
process.on("unhandledRejection", (err) => {
  console.log(`ERROR, ${err}`);
  console.log("Shutting down server due to unhundled promise rejection");
  server.close(() => {
    process.exit(1);
  });
});

