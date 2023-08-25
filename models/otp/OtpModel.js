import mongoose from "mongoose";
import bcrypt from 'bcrypt'
const otpSchema = new mongoose.Schema({
  _userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  otp: { type: String, required: true },
  expireAt: { type: Date, default: Date.now, index: { expires: 86400000 } },
});

otpSchema.methods.matchOTP = async function(otp) {
    return await bcrypt.compare(otp, this.otp)
}

otpSchema.pre("save", async function(next){
    if(!this.isModified("otp")){
        return next()
    }
    const salt = await bcrypt.genSalt(10)
    this.otp = await bcrypt.hash(this.otp, salt)
})

const OTP = mongoose.model("OTP", otpSchema)

export default OTP
