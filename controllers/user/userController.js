import User from "../../models/user/UserModel.js";
import { genToken } from "../../config/genToken.js";
import OTP from "../../models/otp/OtpModel.js";
import sgMail from "@sendgrid/mail";


import {
  generateOTP,
  sendMail,
  // sendVerificationEmail,
} from "../../utils/genOtpCode.js";
export const createUser = async (req, res) => {
  const { name, email, phoneNumber, password, confirmPassword } = req.body;
  const trimmed_name = name.trim();
  const trimmed_email = email.trim();
  const trimmed_phoneNumber = phoneNumber.trim();
  const trimmed_password = password.trim();
  const trimmed_confirmPassword = confirmPassword.trim();

  try {
    if (
      !trimmed_name ||
      !trimmed_email ||
      !trimmed_phoneNumber ||
      !trimmed_password ||
      !trimmed_confirmPassword
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
          "Invalid password format; Password be at least 8 characters long, with atleast one uppercase,one lowercase and one special caharacter.",
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
          name,
          email,
          phoneNumber,
          password,
        });

        // generate OTP
        const digits = generateOTP()
        const otp = new OTP({
            _userId: newUser._id,
            otp: digits, 
          });
      
          await otp.save();
          // send email
          // sendVerificationEmail(newUser.email,otp.otp,newUser.name)

          sendMail(newUser.email, digits, newUser.name)

        // genToken
        const token = genToken(newUser._id);
        res.status(200).json({
          status: "success",
          message: "user successfully registered",
          data: {
            name: newUser.name,
            email: newUser.email,
            phoneNumber: newUser.phoneNumber,
          },
          token: token,
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
  const { otp } = req.body;

  try {
    // check if all credentials exist
    if (!otp) {
      return res.status(400).json({
        status: "Failed",
        message: "OTP is required",
      });
    }
    // get token
    const token = await OTP.findOne({ otp });
    // token not found
    if (!token) {
      return res.status(400).json({
        status: "Failed",
        message: "token not found ",
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
        message: "Admin already verified",
      });
    }

    // matched client OTP with the one in our db
    const isMatched = OTP.matchOTP(otp);
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

    //   await (
    //     await sendEmail()
    //   ).sendMail({
    //     from: "Tes-HMS@gmail.com",
    //     to: validAdmin.email,
    //     subject: `Welcome  ${validAdmin.username}`,
    //     html: genSuccessMailTemplate(validAdmin.email),
    //   });

    res.status(200).json({
      status: "success",
      message: "user verified successfully",
      data: {
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        id: user._id,
        isVerified: user.isVerified,
      },
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
    if (user && (await user.matchPassword(trimmed_password))) {
      // genToken
      const token = genToken(user._id);
      res.status(200).json({
        status: "success",
        message: "Login successful",
        data: {
          name: user.name,
          email: user.email,
          phoneNumber: user.phoneNumber,
        },
        token,
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
