import express from "express";
import { 
    getEdit, 
    postEdit,
    logout, 
    startGithubLogin, 
    finishGithubLogin, 
    getChangePassword,
    postChangePassword,
    see 
} from "../controllers/userController.js";
import { protectorMiddleware, publicOnlyMiddleware, avatarUpload } from "../middlewares.js";

const userRouter = express.Router();

// protectorMiddleware, publicOnlyMiddleware
// 위 미들웨어는 session 여부에 따라 페이지를 직접 URL를 입력하여 접속했을 시 대처 역할을 합니다.
userRouter.get("/logout", protectorMiddleware, logout);
userRouter.route("/edit")
    .all(protectorMiddleware)
    .get(getEdit)
    .post(avatarUpload.single("avatar"), postEdit);
userRouter.route("/change-password").all(protectorMiddleware).get(getChangePassword).post(postChangePassword);
userRouter.get("/github/start", publicOnlyMiddleware, startGithubLogin);
userRouter.get("/github/finish", publicOnlyMiddleware, finishGithubLogin);
userRouter.get(":id", see);

export default userRouter;
