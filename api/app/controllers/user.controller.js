import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";
import { secret } from "../index.js";

export const getUser = async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    let authToken = "";
    if (authHeader) {
      authToken = authHeader.split(" ")[1];
    }
    console.log("authToken", authToken);
    const checkUserToken = jwt.verify(authToken, secret);
    console.log(checkUserToken);
    const user = await User.findOne({ _id: checkUserToken.id });
    res.json({
      success: true,
      message: "เข้าสู่ระบบสำเร็จ",
      user: user,
    });
  } catch (error) {
    errorHandler(403, "ไม่มีสิทธิ์ในการเข้าถึง");
  }
};
