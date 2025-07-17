const express = require("express");
const { sendUserBasicInfoController , sendUserDetailsController } = require("./controllers");
const { userAuthenticationMiddleware } = require("../middleware");
const usersRouter = express.Router();

usersRouter.get("/", userAuthenticationMiddleware, sendUserBasicInfoController);
usersRouter.get("/details", userAuthenticationMiddleware, sendUserDetailsController); 

module.exports = { usersRouter };

