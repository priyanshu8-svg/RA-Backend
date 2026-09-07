import mongoose from 'mongoose';

const backlistTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: [true, "token is required to be added in blacklist"]
    }
}, { timestamps: true })

const blacklistTokenModel = mongoose.model("BlacklistToken", backlistTokenSchema);
export default blacklistTokenModel;