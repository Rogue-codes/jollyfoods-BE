import mongoose from "mongoose";

const regionSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    state:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"State",
        required: true,    
    }
})

const Region = mongoose.model("Region", regionSchema)

export default Region