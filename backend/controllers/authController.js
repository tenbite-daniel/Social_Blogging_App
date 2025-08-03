import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const generateAccessToken = (user) => {
    return jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "15m",
    });
};

const generateRefreshToken = () => {
    return crypto.randomBytes(64).toString("hex");
};

export const register = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const hashedPwd = await bcrypt.hash(password, 10);
        const user = new User({ username, email, password: hashedPwd });
        await user.save();
        res.status(201).json({ message: "User registered" });
    } catch (error) {
        res.status(500).json({
            error: "Registration failed",
            details: error.message,
        });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password)))
            return res.status(401).json({ error: "Invalid Credentials" });

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken();
        user.refreshToken = refreshToken;
        await user.save();

        res.cookie("jwt", refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "Lax",
            maxAge: 24 * 60 * 60 * 1000,
        }).json({ accessToken });
    } catch (error) {
        res.status(500).json({
            error: "Login failed",
            details: error.message,
        });
    }
};

export const refreshToken = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.status(401).json({ error: "No token" });

    const refreshToken = cookies.jwt;
    const user = await User.findOne({ refreshToken });

    if (!user) return res.status(403).json({ error: "Invalid refresh token" });
    const accessToken = generateAccessToken(user);
    res.json({ accessToken });
};

export const logout = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204);
    const user = await User.findOne({ refreshToken: cookies.jwt });
    if (user) {
        user.refreshToken = "";
        await user.save();
    }
    res.clearCookie("jwt", { httpOnly: true });
    res.json({ message: "Logged out" });
};
