import express from 'express';
import * as authController from '../controllers/auth.controller.js';
import authUser from '../middlewares/auth.middleware.js';
const AuthRouter = express.Router();

// This comment is used to give any brief description of the code[JS DOC COMMENT]

/**
 * @route POST /api/auth/register
 * @description Register a new user
 * @access Public
 */
AuthRouter.post("/register", authController.registerUserController)

/**
 * @route POST /api/auth/login
 * @description Login a user
 * @access Public
 */
AuthRouter.post("/login", authController.loginUserController)



/**
 * @route GET /api/auth/logout
 * @description logout a user
 * @access Public
 */
AuthRouter.get("/logout", authController.logoutUserController)


/**
 * @route GET /api/auth/get-me
 * @description get current logged in user
 * @access Public
 */
AuthRouter.get("/get-me", authUser, authController.getMeController)
export default AuthRouter;
