import nodemailer, { TransportOptions } from "nodemailer";

class Sendmail {
  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secureConnection: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  sendVerificationMail(reciever, code) {
    let message = {
      from: process.env.EMAIL_USER,
      to: reciever,
      subject: "Confirm Email",
      text: "Please confirm your email",
      html:
        "<p>Please confirm your email.the code for conformation is " +
        code +
        "</p>",
    };
    return new Promise((resolve, reject) => {
      transporter.sendMail(message, (error, info) => {
        if (error) {
          return reject(error);
        }
        resolve("Message sent: %s", info.messageId);
      });
    });
  }
  sendResetmail() {}
}

export default Sendmail;
