import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 30
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    name: {
        type: String,
        trim: true,
        maxlength: 100
    },
    avatar: {
        type: String,
        trim: true
    },
    refreshToken: { 
        type: String 
    },
}, {
    timestamps: true
});

export default mongoose.model("User", userSchema);
