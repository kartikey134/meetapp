const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const asyncHandler = require('express-async-handler');

// Login route;
const login = asyncHandler(async(req, res) => {
    let errors = []
    try {
        const {email, password} = req.body;
        // Check fields
        if (!email || !password) {
            errors.push("Please fill in all fields");
            return res.status(200).json({ message: errors, success: false });
        } else {
            const user = User.findOne({email: email});
            if (user) {
                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if (err) {
                        errors.push("Internal Server Error");
                        return res.status(200).json({ message: errors, success: false });
                    } else {
                        if (isMatch) {
                            const payload = {id: user._id, name: user.name};
                            jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, (err, token) => {
                                res.status(200).json({
                                    message: "Signed In",
                                    user: payload,
                                    token,
                                    success: true
                                });
                            });
                        } else {
                            errors.push("Wrong password");
                            res.status(200).json({message: errors, success: false});
                        }
                    }
                });
            } else {
                errors.push("User not found");
                return res.status(200).json({ message: errors, success: false });
            }
        }
    } catch (err) {
        errors.push("Internal Server Error");
        return res.status(200).json({ message: errors, success: false });
    }
});

// Signup route;
const signup = asyncHandler(async(req, res) => {
    let errors = []
    try {
        const {name, email, password, confirm_password} = req.body;
        // Check fields
        if (!name || !email || !password || !confirm_password) {
            errors.push("Please fill in all fields");
        } 
        // Check password 
        if (password !== confirm_password) {
            errors.push("Passwords don't match")
        }
        // Check password length
        if (password.length < 6) {
            errors.push(`Passwords should be atleast 6 characters`);
        }
        if (errors.length > 0) {
            return res.status(200).json({ message: errors, success: false });
        } else {
            let user = await User.findOne({email});
            // Email already exists
            if (user) {
                errors.push("Email already exists");
                return res.status(200).json({ message: errors, success: false });
            } else {
                // Create User
                user = new User({name, email, password});
                // Hash password
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(user.password, salt, async (err, hash) => {
                        try {
                            if (err) {
                                errors.push("Internal Server Error");
                                return res.status(200).json({message: errors, success: false});
                            } 
                            // Set password to hashed
                            user.password = hash;
                            // Save user
                            await user.save();
                            return res.status(200).json({ message: "User created", success: true });
                        } catch (err) {
                            errors.push("Internal Server Error");
                            return res.status(200).json({ message: errors, success: false });
                        }
                    });
                });
            }
        }
    } catch (err) {
        errors.push("Internal Server Error");
        return res.status(200).json({ message: errors, success: false });
    }
});

module.exports = {signup, login};
