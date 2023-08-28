import User from "../../models/user/UserModel.js";
import { genToken } from "../../config/genToken.js";
import OTP from "../../models/otp/OtpModel.js";

import {
  generateOTP,
  sendMail,
  // sendVerificationEmail,
} from "../../utils/genOtpCode.js";
export const createUser = async (req, res) => {
  const {
    name,
    email,
    phoneNumber,
    password,
    confirmPassword,
    healthcareServiceProvider,
  } = req.body;
  const trimmed_name = name.trim();
  const trimmed_email = email.trim();
  const trimmed_phoneNumber = phoneNumber.trim();
  const trimmed_password = password.trim();
  const trimmed_confirmPassword = confirmPassword.trim();
  const trimmed_healthcareServiceProvider = healthcareServiceProvider.trim();

  try {
    if (
      !trimmed_name ||
      !trimmed_email ||
      !trimmed_phoneNumber ||
      !trimmed_password ||
      !trimmed_confirmPassword ||
      !trimmed_healthcareServiceProvider
    ) {
      return res.status(400).json({
        status: "Failed",
        message:
          "name, email, phoneNumber, password,and confirmPassword are all required",
      });
    } else if (!/^[a-zA-Z ]*$/.test(trimmed_name)) {
      return res.status(400).json({
        status: "Failed",
        message: "Invalid Name format entered; name can only contain letters",
      });
    } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(trimmed_email)) {
      return res.status(400).json({
        status: "Failed",
        message: "Invalid Email format entered; enter a valid email address",
      });
    } else if (
      !/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/.test(
        trimmed_password
      )
    ) {
      return res.status(400).json({
        status: "Failed",
        message:
          "Invalid password format; Password must be at least 8 characters long, with one uppercase, one lowercase and a special character.",
      });
    } else if (trimmed_password !== trimmed_confirmPassword) {
      return res.status(400).json({
        status: "Failed",
        message:
          "Passwords does not match; Confirm password must be same with entered password",
      });
    } else if (trimmed_phoneNumber.length !== 11) {
      return res.status(400).json({
        status: "Failed",
        message: "Phone number must be 11 digits",
      });
    } else {
      // check if user already exists
      const alreadyExistingEmail = await User.findOne({ email: trimmed_email });
      const alreadyExistingPhoneNumber = await User.findOne({
        phoneNumber: trimmed_phoneNumber,
      });
      if (alreadyExistingEmail) {
        return res.status(400).json({
          status: "Failed",
          message: "email already exists",
        });
      } else if (alreadyExistingPhoneNumber) {
        return res.status(400).json({
          status: "Failed",
          message: "phone number already exists",
        });
      } else {
        const newUser = await User.create({
          name: trimmed_name,
          email: trimmed_email,
          phoneNumber: trimmed_phoneNumber,
          password: trimmed_password,
          healthcareServiceProvider: trimmed_healthcareServiceProvider,
        });

        // generate OTP
        const digits = generateOTP();
        const otp = new OTP({
          _userId: newUser._id,
          otp: digits,
        });

        await otp.save();
        // send email
        // sendVerificationEmail(newUser.email,otp.otp,newUser.name)

        sendMail(newUser.email, digits, newUser.name);

        res.status(200).json({
          status: "success",
          message: "user successfully registered",
          data: {
            name: newUser.name,
            email: newUser.email,
            phoneNumber: newUser.phoneNumber,
            user_id: newUser._id,
            isVerified: newUser.isVerified,
          },
        });
      }
    }
  } catch (error) {
    res.status(500).json({
      status: "Failed",
      message: error.message,
    });
  }
};

export const verifyEmail = async (req, res) => {
  // destruction request payload
  const { user_id, otp } = req.body;

  try {
    // check if all credentials exist
    if (!otp || !user_id) {
      return res.status(400).json({
        status: "Failed",
        message: "OTP and user ID is required",
      });
    }
    // get token
    const token = await OTP.findOne({ _userId: user_id });
    // token not found
    if (!token) {
      return res.status(400).json({
        status: "Failed",
        message: "token has expired",
      });
    }
    const user = await User.findById(token._userId);
    if (!user) {
      return res.status(404).json({
        status: "Failed",
        message: "User not found",
      });
    }
    // if user is already verified.
    if (user.isVerified) {
      return res.status(400).json({
        status: "Failed",
        message: "user already verified",
      });
    }

    // matched client OTP with the one in our db
    const isMatched = await token.matchOTP(otp);
    if (!isMatched) {
      return res.status(400).json({
        status: "Failed",
        message: "OTP is not valid",
      });
    }
    // if it matches
    user.isVerified = true;
    await OTP.findByIdAndDelete(token._id);
    await user.save();

    // genToken
    const jwt_token = genToken(user._id);
    res.status(200).json({
      status: "success",
      message: "user verified successfully",
      data: {
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        id: user._id,
        isVerified: user.isVerified,
        hmo: user.healthcareServiceProvider
      },
      access_token: jwt_token,
    });
  } catch (error) {
    res.status(500).json({
      status: "Failed",
      message: error.message,
    });
  }
};

export const userLogin = async (req, res) => {
  const { email, password } = req.body;

  const trimmed_email = email.trim();
  const trimmed_password = password.trim();

  try {
    if (!trimmed_email || !trimmed_password) {
      return res.status(400).json({
        status: "Failed",
        message: "Email and password are required",
      });
    }
    // check if email is valid
    const user = await User.findOne({ email: trimmed_email });
    // check if user exist, if they' re verified and if their password match.
    if (
      user &&
      user.isVerified &&
      (await user.matchPassword(trimmed_password))
    ) {
      // genToken
      const token = genToken(user._id);
      res.status(200).json({
        status: "success",
        message: "Login successful",
        data: {
          name: user.name,
          email: user.email,
          phoneNumber: user.phoneNumber,
          id: user._userId,
          isVerified: user.isVerified,
        },
        token,
      });
    } else if (!user.isVerified) {
      return res.status(403).send({
        status: "Failed",
        message:
          "user account not verified. Please verify your account and try again",
      });
    } else {
      res.status(400).json({
        status: "Failed",
        message: "Login failed: Invalid credentials",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "Failed",
      message: error.message,
    });
  }
};

// getUserProfile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      res.status(200).json({
        status: "success",
        message: "User profile retrieved successfully",
        data: {
          name: user.name,
          email: user.email,
          phoneNumber: user.phoneNumber,
          id: user._id,
        },
      });
    }
  } catch (error) {}
};

export const resendToken = async(req, res) => {
  const {user_id} = req.body;
  try {
    if(!user_id){
      return res.status(400).json({
        status:"Failed",
        message:"User_id is required"
      })
    }

    const existOTP = await OTP.findOne({_userId: user_id})
    if (existOTP){
      await OTP.findByIdAndDelete(existOTP._id)
    }

    const digits = generateOTP();
        const otp = new OTP({
          _userId: user_id,
          otp: digits,
        });

        await otp.save();
        // send email
        // sendVerificationEmail(newUser.email,otp.otp,newUser.name)

        const newUser = await User.findById(user_id)

        if (!newUser){
          return res.status(404).json({
            status: "Failed",
            message: "User not found"
          })
        }

        sendMail(newUser.email, digits, newUser.name);
        
        res.status(200).json({
          status:"Success",
          message:"OTP Generated. Please check your email address"
        })

  } catch (error) {
    res.status(500).json({
      status:"Failed",
      message:error.message
    })
  }
}