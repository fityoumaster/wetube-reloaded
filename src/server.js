import "./db.js";
import express from "express";
import morgan from "morgan";
import globalRouter from "./routers/globalRouter.js";
import userRouter from "./routers/userRouter.js";
import videoRouter from "./routers/videoRouter.js";

const PORT = 4000;

const app = express();
const logger = morgan("dev");

// view 엔진 설정
app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");

// 미들웨어 설정
app.use(logger);
// post전송 시 form body 값 읽히도록 설정
app.use(express.urlencoded({extended: true}));
// 라우터 설정
app.use("/", globalRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);

const handleListening = () => console.log(`✅ Server listening on Port http://localhost:${PORT} 🚀`);
app.listen(PORT, handleListening);