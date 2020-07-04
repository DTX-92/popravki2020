import { Router } from "express";
import PublicRouter from "./Public";

// Init router and path
const router = Router();

// Add sub-routes
router.use("/public", PublicRouter);

// Export the base-router
export default router;
