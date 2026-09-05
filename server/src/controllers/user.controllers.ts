import { Request, Response } from "express";
import prisma from "../config/db.js";
import { getPublicID } from "../helper.js";
import { destroyQueue, destroyQueueName } from "../jobs/DestroyJob.js";


export const getUserController = async (req: Request, res: Response) => {

    const user = req.user;

    return res.json({
        data: user
    });
}

export const deleteUserController = async (req: Request, res: Response) => {
    try {

        const duels = await prisma.duel.findMany({
            where: {
                userId: req.user?.id,
            }
        });

        for (let duel of duels) {
            const publicId = getPublicID(duel.image);
            await destroyQueue.add(destroyQueueName, {
                publicId: publicId
            });
        }

        await prisma.user.delete({
            where: {
                id: req.user?.id
            }
        });

        return res.status(200).json({
            "message": "User account deleted"
        })

    } catch (error) {
        return res.status(500).json({
            "message": "Something went wrong"
        })
    }
}