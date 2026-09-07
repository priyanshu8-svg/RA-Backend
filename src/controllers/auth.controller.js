import userModel from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import blacklistTokenModel from "../models/blacklist.model.js";



/**
 * @name registerUserController 
 * @description Register a new user, expects a username,email and password 
 * @access Public 
 */
export const registerUserController = async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const isUserAlreadyExist = await userModel.findOne({
        $or: [{ username }, { email }]// the $or is used to return the user if any of the given condition is matched
    })

    if (isUserAlreadyExist) {
        // We are using return to discontinue the code if we don't use return then the code will continue to run.
        return res.status(400).json({ message: "User already exist with this username or email" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userModel.create({
        username,
        email,
        password: hashedPassword
    })


    const token = jwt.sign(
        {
            id: user._id, username: user.username
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );

    res.cookie("token", token)

    res.status(201).json({
        message: "User registered successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
}


/**
 * @name loginUserController
 * @description login a user, expects email and password
 * @access Public
 */

export const loginUserController = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
        return res.status(400).json({ msg: "email not found" })
    }

    const isPasswordAvailable = await bcrypt.compare(password, user.password)

    if (!isPasswordAvailable) {
        return res.status(400).json({ msg: "password is incorrect" })
    }

    const token = jwt.sign({
        id: user._id,
        username: user.username,
    }, process.env.JWT_SECRET, { expiresIn: "1h" })

    res.cookie("token", token)

    res.status(200).json({
        message: "User logged in successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
}


/**
 * @name logoutUserController
 * @description logout a user
 * @access Public
 */
export const logoutUserController = async (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(400).json({ message: "No token found" });
    }
    const blacklistToken = await blacklistTokenModel.create({
        token
    })
    res.clearCookie("token");
    res.status(200).json({ message: "User logged out successfully" });
}


/**
 * @name getMeController
 * @description get current logged in user
 * @access Public
 */
export const getMeController = async (req, res) => {

    const user = await userModel.findById(req.user.id);
    if (!user) {
        return res.status(404).json({ message: "User not found" })
    }
    return res.status(200).json({
        message: "User fetched successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })



}