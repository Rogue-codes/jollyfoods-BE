import Reservation from "../../models/reservation/reservationModel.js";
import Restuarant from "../../models/resturant/resturantModel.js";
import User from "../../models/user/UserModel.js";
import { generateRandomUUID, sendMail, sendReservationMail } from "../../utils/genOtpCode.js";
export const createReservation = async (req, res) => {
  const {
    resturant_id,
    booked_date,
    booked_time,
    number_of_seats,
    customer_id,
    children,
    adult,
    amount,
  } = req.body;
  try {
    if (
      !resturant_id ||
      !booked_date ||
      !booked_time ||
      !number_of_seats ||
      !customer_id ||
      !adult
    ) {
      return res.status(400).json({
        status: "Failed",
        message:
          "Invalid request; retaurant_id, booked_date, booked_time, number_of_seats,customer_id,adult are all required...",
      });
    }
    // if (!children) {
    //   children = 0;
    // }

    const reservation_code = generateRandomUUID(10);

    // get resturant meta
    const restaurant = await Restuarant.findById(resturant_id);

    if (!restaurant) {
      return res.status(404).json({
        status: "Resturant not found... invalid ID",
      });
    }

    // get customer meta
    const Customer = await User.findById(customer_id).select("-password");

    if (!Customer) {
      return res.status(404).json({
        status: "customer not found... invalid ID",
      });
    }

    // check if reservation already exists to prevent multiple reservations.

    const alreadyExistingReservation = await Reservation.findOne({
      customer_id,
    });

    if (alreadyExistingReservation) {
      return res.status(400).json({
        status: "Failed",
        message: "A Reservation already exists for this customer",
      });
    }

    const reservation = await Reservation.create({
      resturant_id,
      booked_date,
      booked_time,
      number_of_seats,
      customer_id,
      children: 0,
      adult,
      reservation_code,
      amount,
    });

    // send email notification to the customer.
    sendReservationMail(Customer.email, reservation_code, Customer.name,booked_date);

    res.status(201).json({
      status: "success",
      message: "Reservation has been created...",
      data: { reservation, Customer, restaurant },
    });

    console.log(req.user)

  } catch (error) {
    res.status(500).json({
      status: "Failed",
      message: error.message,
    });
  }
};