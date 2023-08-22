import mongoose from "mongoose";

const stateSchema = new mongoose.Schema({
    state_name:{
        type:String,
        required:true,
    }
})

const State = mongoose.model('State', stateSchema)

export default State