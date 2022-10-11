
import { userModel } from "../models/userModels.js";
import { sendToken } from "../utils/jwtToken.js";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt'
import cloudinary from "../utils/imagesuploader.js";
import transporter from "../config/emailsender.js";
// Register a User
export const registerUser = async (req, res, next) => {
    //console.log(req);
    const file = req.files.avatar;
    const myCloud = await cloudinary.v2.uploader.upload(file.tempFilePath, {
        folder: "avatars",
        width: 150,
        crop: "scale",
        public_id: `${Date.now()}`
    })
    const { name, email, password, confirmpassword } = req.body;

    const user = await userModel.findOne({ email: email })
    console.log("data", user);

    if (user) {
        res.send({ "status": "failed", "message": "Email already exists" })

    }
    else {
        if (name && email && password && confirmpassword) {
            if (password === confirmpassword) {
                const salt = await bcrypt.genSalt(10)
                const hashPassword = await bcrypt.hash(password, salt)

                try {
                    const data = await userModel.create({
                        name: name,
                        email: email,
                        password: hashPassword,
                        avatar: {
                            public_id: myCloud.public_id,
                            url: myCloud.secure_url,
                        },
                    });
                    data.save()
                    const saved_user = await userModel.findOne({ email: email })

                    sendToken(saved_user, 201, res);
                }
                catch (error) {
                    console.log(error);
                }
            }
            else {
                res.send({ "status": "failed", "message": "Psssword and Confirmed PAssword does't match" })
            }
        }
        else {
            res.send({ "status": "failed", "message": "All feild are required" })
        }
    }

};

export const userdetail=async(req,res)=>{
try{
    const id=req.logindata.id ;
    const userdetail=await userModel.findById(id);
    res.status(202).send({userdetail,"message":`${id} user detail is showing`})
}
catch(err)
{
    res.send({ "status": "failed", "message": "user details is not showing" })
}
}



export const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body
        if (email && password) {
            const user = await userModel.findOne({ email: email }).select("+password");
            if (user != null) {
                const isMatch = await bcrypt.compareSync(password, user.password)
                if ((user.email === email) && isMatch) {
                    // Generate JWT Token        
                    sendToken(user, 201, res);
                } else {
                    res.send({ "status": "failed", "message": "Email or Password is not Valid" })
                }
            } else {
                res.send({ "status": "failed", "message": "You are not a Registered User" })
            }
        } else {
            res.send({ "status": "failed", "message": "All Fields are Required" })
        }
    } catch (error) {
        console.log(error)
        res.send({ "status": "failed", "message": "Unable to Login" })
    }
}

export const userlogout = async (req, res, next) => {
    try {
        res.clearCookie('token');
        res.status(200).json({
            success: true,
            message: "Logged Out",
        });
    }
    catch (error) {
        return res.status(404).json(error);
    }
};


export const changeUserPassword = async (req, res) => {
    const { currentpasword, newpassword, newpassword_confirmation } = req.body
    if (currentpasword && newpassword && newpassword_confirmation) {
        const user = await userModel.findById({ _id: req.logindata.id }).select("+password")
        const isMatch = await bcrypt.compareSync(currentpasword, user.password)
        if (isMatch) {
            if (newpassword !== newpassword_confirmation) {
                res.send({ "status": "failed", "message": "New Password and Confirm New Password doesn't match" })
            } else {
                const salt = await bcrypt.genSalt(10)
                const newHashPassword = await bcrypt.hash(newpassword, salt)
                await userModel.findByIdAndUpdate(req.logindata.id, { $set: { password: newHashPassword } })
                res.send({ "status": "success", "message": "Password changed succesfully" })
            }
        } else {
            res.send({ "status": "failed", "message": "Invalid current password !!" })
        }
    } else {
        res.send({ "status": "failed", "message": "All Fields are Required" })
    }
}


export const sendUserPasswordResetEmail = async (req, res) => {
    const { email } = req.body
    if (email) {
      const user = await userModel.findOne({ email: email })
      if (user) {
        const secret = user._id + process.env.JWT_SECRET
        const token = jwt.sign({ id: user._id }, secret, { expiresIn: '15m' })
        const link = `http://localhost:5002/api/user/v1/resetpassword/${user._id}/${token}`
        console.log(link)
        // // Send Email
        let info = await transporter.sendMail({
          from: process.env.EMAIL_FROM,
          to: user.email,
          subject: "CURD Operation - Password Reset Link",
          html: `<a href=${link}>Click Here</a> to Reset Your Password`
        })
        res.send({ "status": "success", "message": "Password Reset Email Sent... Please Check Your Email" })
      } else {
        res.send({ "status": "failed", "message": "Email doesn't exists" })
      }
    } else {
      res.send({ "status": "failed", "message": "Email Field is Required" })
    }
  }

  export const  userPasswordReset = async (req, res) => {
    console.log(req.body);
    const { password, password_confirmation } = req.body
    const { id, token } = req.params
    const user = await userModel.findById(id)
    const new_secret = user._id + process.env.JWT_SECRET
    try {
      jwt.verify(token, new_secret)
      if (password && password_confirmation) {
        if (password !== password_confirmation) {
          res.send({ "status": "failed", "message": "New Password and Confirm New Password doesn't match" })
        } else {
          const salt = await bcrypt.genSalt(10)
          const newHashPassword = await bcrypt.hash(password, salt)
          await userModel.findByIdAndUpdate(user._id, { $set: { password: newHashPassword } })
          res.send({ "status": "success", "message": "Password Reset Successfully" })
        }
      } else {
        res.send({ "status": "failed", "message": "All Fields are Required" })
      }
    } catch (error) {
      console.log(error)
      res.send({ "status": "failed", "message": "Invalid Token" })
    }
  }
