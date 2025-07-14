import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import authRoutes from "../app/routes/auth.route.js";
import userRoutes from "../app/routes/user.route.js";

mongoose
  .connect(
    "mongodb+srv://qwerty:Qwerty@cluster0.4wlucv5.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();
const port = 3009;
export const secret = "mysecret";

app.use(express.json());
app.use(cors({ credentials: true }));

app.listen(port, () => {
  console.log(`Server is running on port:${port}`);
});

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode;
  const message = err.message;
  return res.status(statusCode).json({
    success: false,
    message,
    statusCode,
  });
});
