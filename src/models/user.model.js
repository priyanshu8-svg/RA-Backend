import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

    username: {
        type: String,
        unique: [true, "username already taken"],
        required: [true, "username is required"],
        trim: true,
        lowercase: true,
    },
    email: {
        type: String,
        unique: [true, "email already taken"],
        required: [true, "email is required"],
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: [true, "password is required"],
        trim: true,
    }

})

const userModel = mongoose.model("User", userSchema);
export default userModel;