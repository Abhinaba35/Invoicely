
const updateUserProfileController = async (req, res) => {
    try {
        const { _id } = req.user;
        const { name, mobile, gender } = req.body;
        const updatedUser = await UserModel.findByIdAndUpdate(
            _id,
            { name, mobileno: mobile, gender },
            { new: true, runValidators: true, context: 'query' }
        ).select("-password");
        res.status(200).json({
            isSuccess: true,
            message: "Profile updated!",
            data: { user: updatedUser },
        });
    } catch (err) {
        handleGenericAPIError("updateUserProfileController", req, res, err);
    }
};
const { UserModel } = require("../../../models/userSchema");
const { handleGenericAPIError } = require("../../../utils/controllerHelpers");
const { uploadToCloudinary } = require("../../../config/cloudinary");



const sendUserBasicInfoController = (req, res) => {
     const userInfo = req.user;

    res.status(200).json({
        isSuccess: true,
        message: "User is valid!",
        data: {
            user: userInfo,
        }
    });
};

const sendUserDetailsController = async (req, res) => {
    try {
        const { _id } = req.user;
        const user = await UserModel.findById(_id).select("-password");
        res.status(200).json({
            isSuccess: true,
            message: "User details found!",
            data: {
                user: user,
            },
        });
    } catch (err) {
        handleGenericAPIError("sendUserDetailsController", req, res, err);
    }
};

const updateDisplayPictureController = async (req, res) => {
    const uploadedFile = await uploadToCloudinary(req.file.path);
    const { _id: userId } = req.user;

    console.log("File url -->", uploadedFile.url);

    await UserModel.findByIdAndUpdate(userId, {
        imageUrl: uploadedFile.url,
    });

    res.status(201).json({
        isSuccess: true,
        message: "file uploaded",
        data: {
            imageUrl: uploadedFile.url,
        },
    });
}


module.exports = { sendUserBasicInfoController, sendUserDetailsController, updateDisplayPictureController, updateUserProfileController };
