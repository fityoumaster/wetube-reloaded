import express from "express";
import morgan from "morgan";
import session from "express-session";
import MongoStore from "connect-mongo";
import rootRouter from "./routers/rootRouter.js";
import userRouter from "./routers/userRouter.js";
import videoRouter from "./routers/videoRouter.js";
import { localsMiddleware } from "./middlewares.js";

const app = express();

// HTTP Request 요청 시 발생하는 로그 미들웨어 입니다.
const logger = morgan("dev");

// .pug view engine을 설정합니다.
app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");

// 미들웨어를 설정합니다.
app.use(logger);

// post전송 시 form body 값이 읽히도록 설정합니다.
app.use(express.urlencoded({extended: true}));

// 쿠키/세션을 설정합니다.
app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,

    // 쿠키/세션이 컴파일 될 때마다 끊기지 않기 위해 MongoDB에 저장하여 항상 유지 합니다.
    store: MongoStore.create({mongoUrl: process.env.DB_URL})
}));

/*
global 전역벽수 locals 미들웨어 입니다.
locals는 .pug/.ejs 템플릿에서 기본으로 공유될 수 있는 변수 입니다.
*/
app.use(localsMiddleware);

// 라우터를 설정합니다.
app.use("/", rootRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);

export default app;