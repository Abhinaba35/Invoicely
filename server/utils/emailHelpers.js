const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
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

const sendOtpMail = async (email, otp) => {
    // ...existing code...
};

const sendEmail = async (to, subject, html) => {
    try {
        await transporter.sendMail({
            from: '"Abhinaba" <team@Abhinaba.com>',
            to,
            subject,
            html,
        });
        console.log("---> email sent!");
    } catch (err) {
        console.log("------------ 🔴 Could not send email", err.message);
        throw "Error in sending Email!";
    }
};

module.exports = { sendOtpMail, sendEmail };
