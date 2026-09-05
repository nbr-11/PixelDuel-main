import { Job, Queue, Worker } from "bullmq";
import { defaultQueueOptions, redisConnection } from "../config/queue.js";
import prisma from "../config/db.js";



interface votingQueueJobDataType {
    duelId: number,
    duelItemId: number,
}

export const votingQueueName = "votingQueue";

export const votingQueue = new Queue(votingQueueName, {
    connection: redisConnection,
    defaultJobOptions: {
        ...defaultQueueOptions,
        delay: 500
    }
});

export const votingQueueWorker = new Worker(votingQueueName, async (job: Job) => {

    //recieveData

    const votingJobData: votingQueueJobDataType = job.data;

    //update the database

    await prisma.duelItem.update({
        where: {
            id: Number(votingJobData.duelItemId)
        },
        data: {
            count: {
                increment: 1
            }
        }
    });


}, {
    connection: redisConnection
});

