import { Request, Response } from "express";
import { imageValidator } from "../helper.js";
import { uploadQueue, uploadQueueName } from "../jobs/UploadJob.js";
import prisma from "../config/db.js";


export const createDuelItem = async (req: Request, res: Response) => {
    try {

        const { id } = req.body;
        const images = req.files as Express.Multer.File[];
        let imageErrors: Array<string> = [];

        if (images?.length >= 2) {

            //check validations

            images.map((img) => {
                const validMsg = imageValidator(img?.size, img?.mimetype);
                if (validMsg) imageErrors.push(validMsg);
            });

            if (imageErrors.length > 0) {
                return res.status(422).json({
                    errors: imageErrors
                })
            }

            //create a duelItem



            //add all the image to upload in a queue
            images.forEach(async (img) => {

                const duelItem = await prisma.duelItem.create({
                    data: {
                        duelId: Number(id),
                        image: "https://res.cloudinary.com/dmqwx60mi/image/upload/v1726128344/mxiwwkx5i8usgnliqtbi.png",
                    }
                });

                await uploadQueue.add(uploadQueueName, {
                    localFilePath: img.path,
                    duelItemId: duelItem.id
                });
            });

            return res.status(200).json({
                message: "Duel Item created successully",
                erros: []
            });


        }

        return res.status(422).json({
            "message": "insufficient images",
            "errors": ["Please select at least two images for the duel"]
        })


    } catch (error) {

    }
}
