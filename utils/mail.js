import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: "codasphere@gmail.com",
    pass: "pjcz aqbm nzmb vjog",
  },
});

export const sendMail = (fromName, fromEmail, toEmail, newUser) => {
  transporter
    .sendMail({
      from: ` ${fromName} <${fromEmail}>`, // sender address
      to: `${toEmail}`, // list of receivers
      subject: "New user has registered", // Subject line
      html: `New user has been registered: ${newUser} pending for the admin approval.`, // html body
    })
    .then((info) => {
      console.log({ info });
    })
    .catch(console.error);
};