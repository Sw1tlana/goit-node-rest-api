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

// const message = {
//     to: ["svitlana.lightbeam@gmail.com"],
//     from: "felix@gmail.com",
//     subject: 'Hello!!!',
//     html: '<h1 style="color: red;">Click on <a href="#" target="_blank">Link</a></h1>',
//     text: 'Click on link'
// };

const sendMail = (message) => {
    return transport.sendMail(message);
}

export default sendMail;

// transport.sendMail(message)
//     .then(() => console.log('Email sent successfully'))
//     .catch(console.error);
