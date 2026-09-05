import { Job, Queue, Worker } from "bullmq";
import { defaultQueueOptions, redisConnection } from "../config/queue.js";
import prisma from "../config/db.js";


interface commentQueueJobDataType {
    duelId: number,
    comment: string,
    created_at: string
}

export const commentQueueName = "commentQueue";

export const commentQueue = new Queue(commentQueueName, {
    connection: redisConnection,
    defaultJobOptions: {
        ...defaultQueueOptions,
        delay: 500
    }
});

export const commentQueueWorker = new Worker(commentQueueName, async (job: Job) => {

    //recieveData

    const commentJobData: commentQueueJobDataType = job.data;

    //update the database

    await prisma.duelComment.create({
        data: {
            ...commentJobData,
            created_at: new Date(commentJobData.created_at).toISOString()
        }
    });


}, {
    connection: redisConnection
});

