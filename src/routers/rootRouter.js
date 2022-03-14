import express from "express";
import { home, search } from "../controllers/videoController.js";
import { getJoin, postJoin, login } from "../controllers/userController.js";

const rootRouter = express.Router();

rootRouter.get("/", home);
rootRouter.route("/join").get(getJoin).post(postJoin);
rootRouter.get("/login", login);
rootRouter.get("/search", search);

export default rootRouter;
