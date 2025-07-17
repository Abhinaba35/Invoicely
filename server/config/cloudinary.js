const cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
});

const uploadToCloudinary = async (filePath) => {
    const pr = new Promise((resolve, reject) => {
        cloudinary.uploader.upload(filePath, { folder: "lpu-offline/users" }, (error, result) => {
            if (error) {
                console.log("------- ❌ cloudinary file upload error ---------");
                reject(error);
                console.log("------- ------------------------- ---------");
            } else {
                console.log("------- ✅ file uploaded to cloudinary ---------");
                resolve(result);
            }
        });
    });
    return pr;
};

module.exports = { uploadToCloudinary };