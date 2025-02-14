import express from "express";
import {
  addToCart,
  checkUser,
  deleteUser,
  getAllCart,
  getAllUsers,
  getOneUser,
  getPin,
  getUser,
  login,
  logout,
  register,
  savePin,
  saveShippingInfo,
  updateUser,
  updateUserInfo,
} from "../controller/userController.js";
import { authorizeRoles, isAuthenticated } from "../middlewares/auth.js";
const userRouter = express.Router();

userRouter.route("/checkUser").post(checkUser);
userRouter.route("/register").post(register);
userRouter.route("/login").post(login);
userRouter.route("/logout").get(logout);
userRouter.route("/user").get(getUser).patch(updateUserInfo);
userRouter.route("/user/pincode").post(savePin).get(getPin);
userRouter.route("/cart").post(isAuthenticated, addToCart);
userRouter.route("/cart/all").get(isAuthenticated, getAllCart);
userRouter.route("/address/save").post(saveShippingInfo);
userRouter
  .route("/admin/users")
  .get(isAuthenticated, authorizeRoles("admin"), getAllUsers);
userRouter
  .route("/admin/user/:id")
  .get(isAuthenticated, authorizeRoles("admin"), getOneUser)
  .put(isAuthenticated, authorizeRoles("admin"), updateUser)
  .delete(isAuthenticated, authorizeRoles("admin"), deleteUser);
export default userRouter;
