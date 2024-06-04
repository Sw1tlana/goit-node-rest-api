import nodemailer from "nodemailer";
import "dotenv/config";

var transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.MAILTRAP_USERNAME,
    pass: process.env.MAILTRAP_PASSWORD,
  }
});

const sendMail = (message) => {
  return transport.sendMail(message );
}

export default sendMail;


