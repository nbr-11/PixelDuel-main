import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

export const uploadOnCloudinary = async (localFilePath: string) => {
    try {
        if (!localFilePath) return null;

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        });

        fs.unlinkSync(localFilePath);

        return response;

    } catch (error) {
        throw error
    }
}

export const removeFromCloudinary = async (imagePublicId: string) => {
    try {

        if (!imagePublicId) return null;

        const response = await cloudinary.uploader.destroy(imagePublicId, {
            resource_type: "image"
        });

        return response;

    } catch (err) {
        throw err
    }
}