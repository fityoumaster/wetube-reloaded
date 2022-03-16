import express from "express";
import morgan from "morgan";
import session from "express-session";
import rootRouter from "./routers/rootRouter.js";
import userRouter from "./routers/userRouter.js";
import videoRouter from "./routers/videoRouter.js";

const app = express();
const logger = morgan("dev");

// view 엔진 설정
app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");

// 미들웨어 설정
app.use(logger);
// post전송 시 form body 값 읽히도록 설정
app.use(express.urlencoded({extended: true}));
// 세션 설정
app.use(session({
    secret: "Hello!",
    resave: true,
    saveUninitialized: true
}));

app.use((req, res, next) => {
    req.sessionStore.all((error, sessions) => {
        console.log(sessions);
        next();
    });
});

// 라우터 설정
app.use("/", rootRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);

export default app;