const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.SMTP_USER, // your gmail
        pass: process.env.SMTP_PASS, // app password
    },
});

(async () => {
    try {
        await transporter.verify();
        console.log("-------- MAIL Server is ready! -----------");
    } catch (err) {
        console.log("-------- ❌ MAIL Server is Error! -----------");
        console.log(err.message);
    }
})();

const sendEmail = async (to, subject, html) => {
    try {
        await transporter.sendMail({
            from: `"Invoicely" <${process.env.SMTP_USER}>`, // FIXED
            to,
            subject,
            html,
        });

        console.log("---> email sent!");
    } catch (err) {
        console.log("------------ 🔴 Could not send email", err);
        throw "Error in sending Email!";
    }
};

const sendOtpMail = async (email, otp) => {
    return sendEmail(
        email,
        "Your OTP Code",
        `<h1>Your OTP is <b>${otp}</b></h1>`
    );
};

module.exports = { sendOtpMail, sendEmail };
