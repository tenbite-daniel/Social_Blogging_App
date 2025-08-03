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
    const { username, email, password, name } = req.body;
    
    try {
       
        const existingUser = await User.findOne({ 
            $or: [{ email }, { username }] 
        });
        
        if (existingUser) {
            return res.status(409).json({ 
                error: existingUser.email === email ? "Email already exists" : "Username already exists" 
            });
        }

        const hashedPwd = await bcrypt.hash(password, 10);
        const user = new User({ 
            username, 
            email, 
            password: hashedPwd,
            name: name || username 
        });
        
        await user.save();
        
        res.status(201).json({ 
            success: true,
            message: "User registered successfully" 
        });
    } catch (error) {
        console.error('Registration error:', error);
        
        if (error.name === 'ValidationError') {
            const validationErrors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                error: 'Validation error',
                details: validationErrors
            });
        }
        
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

// Get user profile
export const getProfile = async (req, res) => {
    try {
        console.log('Profile request for user ID:', req.user.id);
        
        const user = await User.findById(req.user.id).select('-password -refreshToken');
        if (!user) {
            console.log('User not found with ID:', req.user.id);
            return res.status(404).json({ error: "User not found" });
        }
        
        console.log('Profile found for user:', user.username);
        res.json({ 
            success: true,
            user: user 
        });
    } catch (error) {
        console.error('Profile fetch error:', error);
        res.status(500).json({
            error: "Failed to fetch profile",
            details: error.message,
        });
    }
};

// Update user profile
export const updateProfile = async (req, res) => {
    try {
        const { username, email, name, avatar } = req.body;
        const userId = req.user.id;

        // Check if email is already taken by another user
        if (email) {
            const existingUser = await User.findOne({ 
                email, 
                _id: { $ne: userId } 
            });
            if (existingUser) {
                return res.status(409).json({ error: "Email already taken" });
            }
        }

        
        if (username) {
            const existingUser = await User.findOne({ 
                username, 
                _id: { $ne: userId } 
            });
            if (existingUser) {
                return res.status(409).json({ error: "Username already taken" });
            }
        }

        const updateData = {};
        if (username) updateData.username = username;
        if (email) updateData.email = email;
        if (name !== undefined) updateData.name = name;
        if (avatar !== undefined) updateData.avatar = avatar;

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updateData,
            { new: true, runValidators: true }
        ).select('-password -refreshToken');

        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json({
            success: true,
            message: "Profile updated successfully",
            user: updatedUser
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const validationErrors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                error: 'Validation error',
                details: validationErrors
            });
        }
        res.status(500).json({
            error: "Failed to update profile",
            details: error.message,
        });
    }
};

// Delete user account
export const deleteProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const deletedUser = await User.findByIdAndDelete(userId);
        
        if (!deletedUser) {
            return res.status(404).json({ error: "User not found" });
        }

        // Clear cookies
        res.clearCookie("jwt", { httpOnly: true });
        
        res.json({
            success: true,
            message: "Account deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            error: "Failed to delete account",
            details: error.message,
        });
    }
};

// Forgot password - send reset token
export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    
    try {
        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(404).json({ error: "User with this email does not exist" });
        }

     
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = Date.now() + 3600000; // 1 hour from now

        
        await User.findByIdAndUpdate(user._id, {
            resetPasswordToken: resetToken,
            resetPasswordExpires: resetTokenExpiry
        });

       
        res.json({
            success: true,
            message: "Password reset token generated",
            resetToken: resetToken 
        });
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({
            error: "Failed to process password reset request",
            details: error.message,
        });
    }
};


export const resetPassword = async (req, res) => {
    const { resetToken, newPassword } = req.body;
    
    try {
       
        const user = await User.findOne({
            resetPasswordToken: resetToken,
            resetPasswordExpires: { $gt: Date.now() }
        });
        
        if (!user) {
            return res.status(400).json({ error: "Invalid or expired reset token" });
        }

        
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        
        
        await User.findByIdAndUpdate(user._id, {
            password: hashedPassword,
            $unset: { 
                resetPasswordToken: 1, 
                resetPasswordExpires: 1 
            }
        });

        res.json({
            success: true,
            message: "Password reset successfully"
        });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({
            error: "Failed to reset password",
            details: error.message,
        });
    }
};