const { OtpModel } = require("../../../models/otpSchema");
const { UserModel } = require("../../../models/userSchema");
const bcrypt = require("bcrypt");
const { customAlphabet } = require("nanoid");
const { attachJWTToken, removeJWTToken } = require("../../../utils/jwtHelpers");
const { handleGenericAPIError } = require("../../../utils/controllerHelpers");
const { sendOtpMail } = require("../../../utils/emailHelpers");
const nanoid = customAlphabet("1234567890", 6);

const userSignupController = async (req, res) => {
    console.log("--> inside userSignupController");
    try {
        const { email, password, otp, name, mobile, gender } = req.body;
        // check if user already exists
        const user = await UserModel.findOne({
            email: email,
        }).lean();

        if (user !== null) {
            res.status(400).json({ isSuccess: false, message: "User already exists! Please Login", data: {} });
            return;
        }

        const sentOtpDoc = await OtpModel.findOne({
            email: email,
        }).sort({ createdAt: -1 }).lean();

        if (sentOtpDoc == null) {
            res.status(400).json({ isSuccess: false, message: "Please resend the otp!", data: {} });
            return;
        }

        const { otp: hashedOtp } = sentOtpDoc;

        const isCorrect = await bcrypt.compare(otp.toString(), hashedOtp);
        console.log("--> OTP comparison:", { providedOtp: otp, isCorrect });
        if (!isCorrect) {
            return res.status(400).json({ isSuccess: false, message: "Incorrect otp! Please try again...", data: {} });
        }

        // Delete the OTP after successful verification
        await OtpModel.deleteOne({ _id: sentOtpDoc._id });

        // Create user with all provided fields
        const userData = { email, password };
        if (name) userData.name = name;
        if (mobile) userData.mobileno = mobile; // Map mobile to mobileno as per schema
        if (gender) userData.gender = gender;

        await UserModel.create(userData);

        res.status(201).json({
            isSuccess: true,
            message: "User created!",
            data: {},
        });
    } catch (err) {
        handleGenericAPIError("userSignupController", req, res, err);
    }
};

const sendOtpController = async (req, res) => {
    console.log("--> inside sendOtpController");
    try {
        const { email } = req.body;

        const otp = nanoid();

        // Delete any existing OTP for this email before creating a new one
        await OtpModel.deleteMany({ email });

        await sendOtpMail(email, otp);

        await OtpModel.create({ email, otp });

        res.status(201).json({ isSuccess: true, message: "Otp sent!" });
    } catch (err) {
        handleGenericAPIError("sendOtpController", req, res, err);
    }
};

const userLoginController = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await UserModel.findOne({
            email: email,
        }).lean();

        if (user === null) {
            res.status(400).json({
                isSuccess: false,
                message: "User does not exists! Please sign up first!",
                data: {},
            });
            return;
        }

        const { password: hashedPassword } = user;

        const isCorrect = bcrypt.compare(password.toString(), hashedPassword);

        if (!isCorrect) {
            res.status(400).json({ isSuccess: false, message: "Incorrect password! Please try again...", data: {} });
        }

        attachJWTToken(res, { email: user.email, _id: user._id });

        res.status(200);
        res.json({
            isSuccess: true,
            message: "Login successful!",
            data: {
                user: { email: user.email, _id: user._id },
            },
        });
    } catch (err) {
        handleGenericAPIError("userLoginController", req, res, err);
    }
};

const logoutController = async (req, res) => {
    console.log("--> inside logoutController");
    removeJWTToken(res, {});
    res.status(200).json({ isSuccess: true, message: "Logout success!" });
};

module.exports = {
    userSignupController,
    userLoginController,
    sendOtpController,
    logoutController,
};
