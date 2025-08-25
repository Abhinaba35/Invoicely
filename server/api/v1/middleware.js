const { handleGenericAPIError } = require("../../utils/controllerHelpers");
const jwt = require("jsonwebtoken");

const userAuthenticationMiddleware = (req, res, next) => {
    console.log("--> inside userAuthenticationMiddleware");
    try {
        let token = req.cookies.authorization;
        // If not in cookies, check Authorization header
        if (!token && req.headers.authorization) {
            if (req.headers.authorization.startsWith("Bearer ")) {
                token = req.headers.authorization.slice(7);
            } else {
                token = req.headers.authorization;
            }
        }
        console.log("--> token", token);
        if (!token) {
            return res.status(401).json({ isSuccess: false, message: "Token not found!" });
        }
        jwt.verify(token, process.env.JWT_SECRET, function (err, decodedData) {
            if (err) {
                return res.status(401).json({
                    isSuccess: false,
                    message: "Invalid token!",
                    data: {},
                });
            } else {
                req.user = decodedData;
                next();
            }
        });


    } catch (err) {
        handleGenericAPIError("userAuthenticationMiddleware", req, res, err);
    }
};

module.exports = { userAuthenticationMiddleware };
