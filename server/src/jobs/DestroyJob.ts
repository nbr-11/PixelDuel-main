import { Queue, Worker } from "bullmq";
import { defaultQueueOptions, redisConnection } from "../config/queue.js";
import { Job } from "bullmq";
import { removeFromCloudinary } from "../utils/cloudinary.js";

interface destroyJobDataType {
    publicId: string
}

export const destroyQueueName = "destroyQueue";

export const destroyQueue = new Queue(destroyQueueName, {
    connection: redisConnection,
    defaultJobOptions: defaultQueueOptions
});


export const destroyQueueWorker = new Worker(destroyQueueName, async (job: Job) => {

    const destroyJobData: destroyJobDataType = job.data;

    await removeFromCloudinary(destroyJobData.publicId);

}, {
    connection: redisConnection
});

