import Reservation from "../../models/reservation/reservationModel.js";
import Restuarant from "../../models/resturant/resturantModel.js";
import User from "../../models/user/UserModel.js";
import {
  SENDRESERVATIONMAIL,
  generateRandomUUID,
} from "../../utils/genOtpCode.js";
export const createReservation = async (req, res) => {
  const {
    resturant_id,
    booked_date,
    booked_time,
    number_of_seats,
    customer_id,
    children,
    adult,
    payment_type,
    amount,
  } = req.body;
  try {
    if (
      !resturant_id ||
      !booked_date ||
      !booked_time ||
      !number_of_seats ||
      !customer_id ||
      !payment_type ||
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

    if (payment_type !== "full" && payment_type !== "half") {
      return res.status(400).json({
        status: "Failed",
        message: "Invalid payment type: Payment can only be full or half",
      });
    }

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

    const reservation = await Reservation.create({
      resturant_id,
      booked_date,
      booked_time,
      number_of_seats,
      customer_id,
      children: !children ? 0 : children,
      adult,
      reservation_code,
      payment_type,
      amount,
    });

    // send email notification to the customer.
    // sendReservationMail(Customer.email, reservation_code, Customer.name,booked_date);

    SENDRESERVATIONMAIL(
      Customer.email,
      reservation_code,
      Customer.name,
      Customer.healthcareServiceProvider,
      booked_date,
      adult,
      children,
      number_of_seats,
      restaurant.resturant_name,
      (info) => {
        // The callback function to handle the result
        console.log("Email sent:", info);
        // You can send a response to the client indicating the email was sent
        res.send("Email sent successfully");
      }
    );

    res.status(201).json({
      status: "success",
      message: "Reservation has been created...",
      data: { reservation, Customer, restaurant },
    });

    console.log(req.user);
  } catch (error) {
    res.status(500).json({
      status: "Failed",
      message: error.message,
    });
  }
};

// confirm reservation.
export const checkoutReservation = async (req, res) => {
  const { reservation_code } = req.body;
  try {
    const completed_reservation = await Reservation.findById(reservation_code);

    if (!completed_reservation) {
      return res.status(404).json({
        status: "Failed",
        message:
          "Couldn't find reservation: Please enter a valid reservation code",
      });
    }
    completed_reservation.isCompleted = true;
    await completed_reservation.save();

    res.status(201).json({
      status: "Success",
      message: "Reservation has been checkouted successfully",
      data: completed_reservation,
    });
  } catch (error) {
    res.status(500).json({
      status: "Failed",
      message: error.message,
    });
  }
};
