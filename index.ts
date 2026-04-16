import { Router, type IRouter } from "express";
import healthRouter from "./health";
import usersRouter from "./users";
import communityRouter from "./community";

const router: IRouter = Router();

router.use(healthRouter);
router.use(usersRouter);
router.use(communityRouter);

export default router;
