import nodemailer, { TransportOptions } from "nodemailer";

class SendMail {
  options: any = {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secureConnection: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  };
  transporter = nodemailer.createTransport(this.options);

  sendVerificationMail(reciever: string, code: string) {
    let message = {
      from: process.env.EMAIL_USER,
      to: reciever,
      subject: "Confirm Email",
      text: "Please confirm your email",
      html:
        "<p>Please confirm your email.The code for conformation is " +
        code +
        "</p>",
    };
    return new Promise((resolve, reject) => {
      this.transporter.sendMail(message, (error, info: any) => {
        if (error) {
          return reject(error);
        }
        resolve(info);
      });
    });
  }
  sendResetmail() {}
}

export default SendMail;
