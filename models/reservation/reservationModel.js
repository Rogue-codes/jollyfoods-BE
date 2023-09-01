import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema({
    reservation_code:{
        type:String,
        required:true,
        unique:true,
    },
    resturant_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Restuarant"
    },
    booked_date:{
        type:String,
        required:true,
    },
    booked_time:{
        type:String,
        required:true,
    },
    CreatedAt:{
        type: Date,
        default:new Date()
    },
    number_of_seats:{
        type: Number,
        required:true,
    },
    customer_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    adult: Number,
    children: Number,
    amount:{
        type: Number,
        required:true,
    },
    payment_status:{
        type:Boolean,
        default:false,
    }
})

const Reservation = mongoose.model('Reservation', reservationSchema)

export default Reservation