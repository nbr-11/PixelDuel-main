import express, { Application, Request, Response } from "express";
import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";
import ejs from "ejs";
import router from "./routes/index.js";
//Queue
import "./jobs/index.js";
import { appLimiter } from "./config/rateLimit.js";
import cors from "cors";
import { Server } from "socket.io";
import { createServer, Server as HttpServer } from "http";
import { setUpSocket } from "./socket.js";
import helmet from "helmet";

const __dirname = path.dirname(fileURLToPath(import.meta.url)); //this will give the path of the current directory


const app: Application = express();
const PORT = process.env.PORT || 8000;

//create a server by passing the app
const server: HttpServer = createServer(app);

//create a socket.io server
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_APP_URL
    }
});


// export the instance
export { io };

setUpSocket(io);

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(appLimiter);
app.use('/api', router);

// set up view engine
app.set("view engine", "ejs");
app.set("views", path.resolve(__dirname, "./views"));



app.get("/", async (req: Request, res: Response) => {

    const html = await ejs.renderFile(__dirname + `/views/emails/welcome.ejs`, { name: "Nishant Rai" });

    // await emailQueue.add(emailQueueName, {
    //     to: "yohalej367@obisims.com",
    //     subject: "Testing...",
    //     body: html
    // })

    return res.json({
        "message": "email successfull"
    });
});




//use the server instead of app

server.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));

