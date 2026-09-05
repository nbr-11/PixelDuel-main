import { Job, Queue, Worker } from "bullmq";
import { defaultQueueOptions, redisConnection } from "../config/queue.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

import prisma from "../config/db.js";
import fs from "fs";


interface uploadJobDataType {
    localFilePath: string
    duelId?: number
    duelItemId?: number
}

export const uploadQueueName = "uploadQueue";

export const uploadQueue = new Queue(uploadQueueName, {
    connection: redisConnection,
    defaultJobOptions: defaultQueueOptions
});

export const uploadWorker = new Worker(uploadQueueName, async (job: Job) => {

    //code that the worker will execute
    const uploadData: uploadJobDataType = job.data;

    const response = await uploadOnCloudinary(uploadData.localFilePath);

    //update the db

    if (uploadData?.duelId) {
        await prisma.duel.update({
            where: {
                id: uploadData.duelId
            },
            data: {
                image: response?.secure_url
            }
        });
    }

    if (uploadData?.duelItemId) {
        await prisma.duelItem.update({
            where: {
                id: uploadData.duelItemId,
            },
            data: {
                image: response?.secure_url
            }
        });
    }

    fs.unlinkSync(uploadData.localFilePath);

}, {
    connection: redisConnection
});
