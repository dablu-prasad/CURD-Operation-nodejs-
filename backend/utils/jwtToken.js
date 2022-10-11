// Create Token and saving in cookie

import jwt from "jsonwebtoken";

export const sendToken = (user, statusCode, res) => {
    const token=   jwt.sign({ email:user.email,id:user._id}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRE,});
  
    // options for cookie
    const options = {
      expiresIn: new Date(
        Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
    };

    res.status(statusCode).cookie("token", token, options).json({
      success: "success",
      username:user.name,
      id:user._id,
      image:user.avatar.url,
      message:"loggedIn"
    });
  };