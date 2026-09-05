import { Request, Response } from "express";
import { ZodError } from "zod";
import { formatError, getPublicID, imageValidator } from "../helper.js";
import { duelSchema } from "../validation/duel.validation.js";
import { uploadQueue, uploadQueueName } from "../jobs/UploadJob.js";
import prisma from "../config/db.js";
import { destroyQueue, destroyQueueName } from "../jobs/DestroyJob.js";


export const createDuelController = async (req: Request, res: Response) => {
    try {

        const body = req.body;
        const payload = duelSchema.parse(body);

        // check file

        if (req.file) {
            const image = req.file
            const validationMessage = imageValidator(image.size, image.mimetype);

            if (validationMessage) {
                return res.status(422).json({
                    errors: { image: validationMessage }
                });
            }


        } else {
            return res.status(422).json({
                errors: { image: "Image required" }
            });
        }


        const duel = await prisma.duel.create({
            data: {
                userId: req.user?.id as number,
                title: payload.title,
                description: payload.description,
                image: "https://res.cloudinary.com/dmqwx60mi/image/upload/v1726128344/mxiwwkx5i8usgnliqtbi.png",
                expire_at: new Date(payload.expire_at)

            }
        });

        await uploadQueue.add(uploadQueueName, {
            duelId: duel.id,
            localFilePath: req.file.path
        });

        return res.status(200).json({
            message: "Duel Created successfully",
            erros: {}
        });


    } catch (error) {

        if (error instanceof ZodError) {

            let errors = formatError(error);

            return res.status(422).json({
                status: 422,
                message: "Inavlid Data",
                errors: errors
            });
        }

        return res.status(500).json({
            status: 500,
            message: "Something went wrong",
            errors: {}
        });
    }
}

export const getAllDuelController = async (req: Request, res: Response) => {
    try {

        const duels = await prisma.duel.findMany({
            where: {
                userId: req.user?.id as number
            },
            orderBy: {
                id: "desc"
            }
        });

        return res.status(200).json({
            message: "Duels fecthed successfully",
            data: duels
        });

    } catch (error) {
        return res.status(500).json({
            "message": "Something went wrong"
        })
    }
}

export const getUniqueController = async (req: Request, res: Response) => {
    try {

        const { id } = req.params;

        const duel = await prisma.duel.findUnique({
            where: {
                id: Number(id),
            },
            include: {
                DuelItem: {
                    select: {
                        image: true,
                        id: true,
                        count: true,
                    }
                },

                DuelComment: {
                    select: {
                        comment: true,
                        id: true,
                        duelId: true,
                        created_at: true,
                    },
                    orderBy: {
                        id: "desc"
                    }
                }
            }
        });

        return res.status(200).json({
            "message": "Duel fetched successfully",
            data: duel
        });

    } catch (error) {
        return res.status(500).json({
            "message": "Something went wrong"
        })
    }
}

export const updateDuelController = async (req: Request, res: Response) => {
    try {

        const body = req.body;
        const payload = duelSchema.parse(body);
        const { id } = req.params;

        const duel = await prisma.duel.findUnique({
            where: {
                id: Number(id),
            }
        });

        if (!duel) {
            return res.status(500).json({
                message: "Invalid Id"
            });
        }

        if (req.file) {

            //validate the image

            const image = req.file;
            const validationMessage = imageValidator(image.size, image.mimetype);

            if (validationMessage) {
                return res.status(422).json({
                    errors: {
                        image: validationMessage
                    }
                });
            }
            //if file is passed then removethePrevious file from cloudinary
            const publicId = getPublicID(duel.image);

            await destroyQueue.add(destroyQueueName, {
                publicId: publicId
            });

            //and then add the new file to the cloudinary using the queue

            await uploadQueue.add(uploadQueueName, {
                duelId: duel?.id,
                localFilePath: req.file.path
            });

        }

        await prisma.duel.update({
            where: {
                id: duel?.id
            },
            data: {
                ...payload,
                expire_at: new Date(payload.expire_at),
            }
        });


        return res.status(200).json({
            "message": "Duel updated successfully",
            errors: {}
        });

    } catch (error) {

        if (error instanceof ZodError) {
            const errors = formatError(error);
            return res.status(422).json({
                message: "Invalid data",
                errors: errors
            })
        }

        return res.status(500).json({
            "message": "Something went wrong"
        });
    }
}

export const deleteDuelController = async (req: Request, res: Response) => {
    try {

        const { id } = req.params;

        const duel = await prisma.duel.delete({
            where: {
                id: Number(id),
                userId: req.user?.id
            }
        });

        //destroy the image

        const publicId = getPublicID(duel.image);

        await destroyQueue.add(destroyQueueName, {
            publicId: publicId,
        });

        return res.status(200).json({
            "message": "Duel Deleted successfully",
            errors: {}
        });

    } catch (error) {
        return res.status(500).json({
            "message": "Somethig went wrong"
        })
    }
}