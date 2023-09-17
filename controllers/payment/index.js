import axios from "axios";
import dotenv from 'dotenv'

dotenv.config()

const PAYSTACK_API_KEY = process.env.PAYSTACK_KEY 
export const paystackPayment = async (req, res) => {
  const { amount, email } = req.body;
  try {
    if (!amount || !email) {
      return res.status(400).json({
        status: "Failed",
        message: "amount and email are required",
      });
    }
    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        amount:amount*100, // Amount in kobo (10000 kobo = 100 NGN)
        email,
        currency: "NGN",
      },
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_API_KEY}`,
        },
      }
    );


    // Return the Paystack payment response to the client
    res.json(response.data);  } catch (error) {
    console.error('Error initiating payment:', error);
    res.status(500).json({ success: false, error: 'Payment initiation failed' });
  }
};

