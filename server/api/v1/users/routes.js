const express = require("express");
const { sendUserBasicInfoController , sendUserDetailsController , updateDisplayPictureController } = require("./controllers");
const { userAuthenticationMiddleware } = require("../middleware");
const usersRouter = express.Router();


const multer = require("multer");
const upload = multer({ dest: "uploads/" });


usersRouter.get("/", userAuthenticationMiddleware, sendUserBasicInfoController);
usersRouter.get("/details", userAuthenticationMiddleware, sendUserDetailsController); 
usersRouter.put("/", userAuthenticationMiddleware, require("./controllers").updateUserProfileController);
usersRouter.put("/display-picture", upload.single("displayPicture"), updateDisplayPictureController);


module.exports = { usersRouter };

