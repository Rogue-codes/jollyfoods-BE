import mongoose from "mongoose";

const resturantSchema = new mongoose.Schema({
  resturant_name: {
    type: String,
    required: true,
    unique: true,
  },
  location_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Location",
    required: true,
  },
  location_name: {
    type:String,
  },
  location_meta: {
    type: {
      address: String,
      id: String,
      region: {
        id: String,
        state: String,
        name: String,
      },
    },
  },
  rating: {
    type: Number,
    required: true,
  },
  open_time: {
    type: String,
    default: "8:00AM",
  },
  close_time: {
    type: String,
    default: "6:00PM",
  },
  price_per_person: {
    type: Number,
    required: true,
  },
  menu: {
    type: [
      {
        meal_type: String,
        meals: [String],
      },
    ],
    required: true,
  },
});

const Restuarant = mongoose.model("Restuarant", resturantSchema);

export default Restuarant;
