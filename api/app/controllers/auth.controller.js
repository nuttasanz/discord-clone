import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { secret } from "../index.js";

export const register = async (req, res, next) => {
  const { email, userName, displayName, password } = req.body;
  const passwordHash = await bcrypt.hash(password, 10);
  const newUser = new User({
    email,
    userName,
    displayName,
    password: passwordHash,
  });
  try {
    await newUser.save();
    res.status(201).json({
      success: true,
      message: "สร้างบัญชีผู้ใช้าสำเร็จ",
      newUser: newUser,
    });
  } catch (error) {
    if (error.keyValue.email) {
      next(errorHandler(409, "มีผู้ใช้อีเมลนี้แล้ว"));
    } else if (error.keyValue.userName) {
      next(errorHandler(422, "มีผู้ใช้งานนี้แล้ว"));
    } else {
      next(error);
    }
  }
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validUser = await User.findOne({ email });
    if (!validUser) {
      next(errorHandler(404, "ไม่มีอีเมลนี้ในระบบ"));
    } else {
      const match = await bcrypt.compare(password, validUser.password);
      if (!match) {
        next(errorHandler(401, "รหัสผ่านผิด"));
      } else {
        const token = jwt.sign({ id: validUser._id, role: "admin" }, secret, {
          expiresIn: "1h",
        });
        res.json({
          success: true,
          message: "เข้าสู่ระบบสำเร็จ",
          validUser: validUser,
          token: token,
        });
      }
    }
  } catch (error) {
    next(error);
  }
};
