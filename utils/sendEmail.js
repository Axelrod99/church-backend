const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, text }) => {
    const transporter = nodemailer.createTransport({
      service: process.env.SERVICE,
      auth: {
        user: process.env.USER,
        pass: process.env.PASS,
      },
    });

  
    var mailOptions = {
      from: process.env.EMAIL_FROM,
      to,
      subject,
      text,
    };
  
    const message = await transporter.sendMail(mailOptions);
    return message;
  };

  module.exports = sendEmail; 