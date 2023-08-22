import mongoose from "mongoose";

 const locationSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    region:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Region",
        required: true
    },
    address:{
        type: String,
        required: true
    }
 })

 const Location = mongoose.model("Location", locationSchema);

 export default Location