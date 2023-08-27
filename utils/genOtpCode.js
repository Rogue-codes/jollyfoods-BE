import sgMail from "@sendgrid/mail";
export const generateOTP = () => {
  let otp = "";
  for (let i = 0; i < 4; i++) {
    otp += Math.floor(Math.random() * 9);
  }
  return otp;
};

export const sendMail = (email,code,name) =>{
  const formatted_name = name.split(" ")[1]
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
  const msg = {
    to: email, 
    from: 'adaraojimba@cloudsa-africa.com',
    subject: 'Email Verification',
    text: 'Welcome Kpangba Food on Wheels',
    html: `<p>Hello ${formatted_name}, Thank you for signing up on <Strong>Kpangba food on wheels!</strong></p> <p>please use this token to verify your account:</p><br><h1 style="font-family: sans-serif; font-size: 58px; vertical-align: top; border-radius: 5px; text-align: center; color: #3498db;" valign="top" align="center" bgcolor="#3498db">${code}</h1>`,
}
  sgMail
    .send(msg)
    .then(() => {
      console.log('Email sent')
    })
    .catch((error) => {
      console.error(error)
    })
}

