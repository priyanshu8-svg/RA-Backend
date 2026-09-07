import jwt from "jsonwebtoken";
import blacklistTokenModel from "../models/blacklist.model.js";

const authUser = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ msg: "token not found" })
    }
    const isBlacklisted = await blacklistTokenModel.findOne({ token });
    if (isBlacklisted) {
        return res.status(401).json({ msg: "invalid token" }) 
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded;
    }
    catch (err) {
        return res.status(401).json({ msg: "invalid token" })
    }
    next();
}

export default authUser;