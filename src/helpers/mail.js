const nodemailer = require('nodemailer');

const mailHelper = module.exports;

mailHelper.sendMail = async(email, mailContent, mailSubject) => {
    const transporter =  nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.GOOGLE_EMAIL,
            pass: process.env.GOOGLE_PASSWORD
        }
    });
    const mainOptions = {
        from: process.env.GOOGLE_EMAIL,
        to: email,
        subject: mailSubject,
        html: mailContent
    }
    return transporter.sendMail(mainOptions);
}