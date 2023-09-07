import sgMail from "@sendgrid/mail";
import crypto from "crypto";
import nodemailer from "nodemailer";

export const generateOTP = () => {
  let otp = "";
  for (let i = 0; i < 4; i++) {
    otp += Math.floor(Math.random() * 9);
  }
  return otp;
};

// export const sendMail = (email, code, name) => {
//   const formatted_name = name.split(" ")[1];
//   sgMail.setApiKey(process.env.SENDGRID_API_KEY);
//   const msg = {
//     to: email,
//     from: "adaraojimba@cloudsa-africa.com",
//     subject: "Email Verification",
//     text: "Welcome Kpangba Food on Wheels",
//     html: `<p>Hello ${formatted_name}, Thank you for signing up on <Strong>Kpangba food on wheels!</strong></p> <p>please use this token to verify your account:</p><br><h1 style="font-family: sans-serif; font-size: 58px; vertical-align: top; border-radius: 5px; text-align: center; color: #3498db;" valign="top" align="center" bgcolor="#3498db">${code}</h1>`,
//   };
//   sgMail
//     .send(msg)
//     .then(() => {
//       console.log(`Email sent to ${email}`);
//     })
//     .catch((error) => {
//       console.error(error);
//     });
// };

// export const sendReservationMail = (email, code, name, date) => {
//   const formatted_name = name.split(" ")[1];

//   const inputDate = new Date(date);

//   const day = inputDate.getUTCDate().toString().padStart(2, "0");
//   const month = (inputDate.getUTCMonth() + 1).toString().padStart(2, "0"); // Month is 0-indexed, so add 1
//   const year = inputDate.getUTCFullYear();

//   const formattedDate = `${day}-${month}-${year}`;

//   sgMail.setApiKey(process.env.SENDGRID_API_KEY);
//   const msg = {
//     to: email,
//     from: "admin@kpangba.com",
//     subject: "Reservation Booking",
//     text: "Reservation confirmed!",
//     html: `<h2>Hello ${formatted_name},</h2>
//     <p>We are thrilled to confirm your reservation with us!</p>

//     <h3>Reservation Details:</h3>
//     <p><strong>Date:</strong> ${formattedDate}</p>
//     <p>Your reservation has been successfully confirmed. To ensure a smooth and enjoyable experience, please keep the following details in mind:</p>

//     <p><strong>Confirmation Code:</strong> <span style="color: #007bff;">${code}</span></p>
//     <p>Please keep this code handy, as it will be required to validate and confirm your reservation.</p>

//     <p>We value your trust in our services and are eagerly looking forward to hosting you on the specified date. Our team is committed to making your experience memorable.</p>

//     <p>If you have any questions or need further assistance, please don't hesitate to reach out to our support team at <a href="mailto:support@example.com">support@example.com</a> or call us at <a href="tel:+1234567890">+123-456-7890</a>.</p>

//     <p>Thank you for choosing us for your reservation. We can't wait to serve you!</p>

//     <p>Best regards,<br>
//     Vincent Odudu<br>
//     Manager<br>
//     Kpangba food on wheeels</p>
//     `,
//   };
//   sgMail
//     .send(msg)
//     .then(() => {
//       console.log(`Email sent to ${email}`);
//     })
//     .catch((error) => {
//       console.error(error);
//     });
// };

export const generateRandomUUID = (length) => {
  const characters =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const randomBytes = crypto.randomBytes(length);
  let result = "";

  for (let i = 0; i < length; i++) {
    const index = randomBytes[i] % characters.length;
    result += characters.charAt(index);
  }

  return result.toLocaleUpperCase();
};

// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "kpangbafoodsonwheels@gmail.com",
    pass: "yiiwmxbqhvgkqhbp",
  },
});

export const SENDMAIL = async (email, code, name, callback) => {
  const formatted_name = name.split(" ")[1];
  try {
    const options = {
      from: "nnamdidanielosuji@gmail.com", // sender address
      to: email, // receiver email
      subject: "Send email in Node.JS with Nodemailer using Gmail account", // Subject line
      text: "Welcome Kpangba Food on Wheels",
      html: `<p>Hello ${formatted_name}, Thank you for signing up on <Strong>Kpangba food on wheels!</strong></p> <p>please use this token to verify your account:</p><br><h1 style="font-family: sans-serif; font-size: 58px; vertical-align: top; border-radius: 5px; text-align: center; color: #3498db;" valign="top" align="center" bgcolor="#3498db">${code}</h1>`,
    };
    const info = await transporter.sendMail(options);
    callback(info);
  } catch (error) {
    console.log(error);
  }
};

export const SENDRESERVATIONMAIL = async (
  email,
  code,
  name,
  date,
  numberOfAdults,
  numberOfChildren,
  numberOfSeatsReserved,
  restaurantName,
  callback
) => {
  const formatted_name = name.split(" ")[1];

  const inputDate = new Date(date);

  const day = inputDate.getUTCDate().toString().padStart(2, "0");
  const month = (inputDate.getUTCMonth() + 1).toString().padStart(2, "0"); // Month is 0-indexed, so add 1
  const year = inputDate.getUTCFullYear();

  const formattedDate = `${day}-${month}-${year}`;

  try {
    const options = {
      from: "nnamdidanielosuji@gmail.com", // sender address
      to: email, // receiver email
      subject: "Reservation Booking",
      text: "Reservation confirmed!",
      html: `<h2 style="color: #000;">Hello ${formatted_name},</h2>
    <p style="color: #000;">We are thrilled to confirm your reservation with us!</p>
    
    <h2 style="color: #000;">Reservation Details:</h2>
    <p style="color: #000;"><strong>Date:</strong> ${formattedDate}</p>
    <p style="color: #000;">Your reservation at <strong>${restaurantName}</strong> has been successfully confirmed. To ensure a smooth and enjoyable experience, please keep the following details in mind:</p>

<p><strong>Confirmation Code:</strong><br/><span style="color: #2B5F2B; font-size: 30px; font-weight: bold;">${code}</span></p>

<p style="color: #2B5F2B; font-size: 20px; font-weight: bold;"><strong>Number of Adults:</strong> ${numberOfAdults}</p>
<p style="color: #2B5F2B; font-size: 20px; font-weight: bold;"><strong>Number of Children:</strong> ${numberOfChildren}</p>
<p style="color: #2B5F2B; font-size: 20px; font-weight: bold;"><strong>Number of Seats Reserved:</strong> ${numberOfSeatsReserved}</p>

<p style="color: #000;">Please keep this code handy, as it will be required to validate and confirm your reservation.</p>

<p style="color: #000;">We value your trust in our services and are eagerly looking forward to hosting you on the specified date. Our team is committed to making your experience memorable.</p>

<p style="color: #000;">If you have any questions or need further assistance, please don't hesitate to reach out to our support team at <a href="mailto:admin@kpangba.com">admin@kpangba.com</a> or call us at <a href="tel:+1234567890">+123-456-7890</a>.</p>

<p style="color: #000;">Thank you for choosing us for your reservation. We can't wait to serve you!</p>

<p style="color: #000;">Best regards,<br>
Vincent Odudu<br>
Manager<br>
Kpangba food on wheels</p>

    `,
    };
    const info = await transporter.sendMail(options);
    callback(info);
  } catch (error) {
    console.log(error);
  }
};
