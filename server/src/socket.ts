import { Server } from "socket.io";
import { votingQueue, votingQueueName } from "./jobs/VotingJob.js";
import { commentQueue, commentQueueName } from "./jobs/CommentJob.js";

export const setUpSocket = (io: Server) => {
    io.on("connection", (socket) => {
        console.log("A user connected");

        io.on("disconnect", () => {

        })

        //event listen;

        //listen to any event;
        socket.onAny(async (eventName: string, data: any) => {
            //logic

            if (eventName.startsWith("duel-")) {
                console.log(data);

                //push a process in the queue that will update the count in the db

                await votingQueue.add(votingQueueName, data);

                socket.broadcast.emit(`duel-${data?.duelId}`, data);

                //broadcast that the client will not recieve it
            } else if (eventName.startsWith("duel_comment-")) {

                await commentQueue.add(commentQueueName, data);
                socket.broadcast.emit(`duel_comment-${data?.duelId}`, data);
            }
        })
    });


}