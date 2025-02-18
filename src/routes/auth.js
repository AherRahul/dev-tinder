const express = require("express");
const { validateSignupData } = require("../utils/validation");
const User = require('../models/user');
const bcrypt = require('bcrypt');
const { validateForgotPasswordEditData } = require("../utils/validation");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
    try {
        // validation of data
        validateSignupData(req);

        const { firstName, lastName, emailId, password } = req.body;

        // encrypt the password
        const passwordHash = await bcrypt.hash(password, 10);

        const userObj = {
            firstName,
            lastName,
            emailId,
            password: passwordHash,
        }

        // creating a new instance of user model
        const user = new User(userObj);
        await user.save();
    
        return res.status(200).send("User added successfully");
    } catch (error) {
        return res.status(400).send("ERROR: " + error.message);
    }
});

authRouter.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body;

        const user = await User.findOne({
            emailId: emailId
        });

        if (user) {
            const isPasswordMatch = await user.validatePassword(password);

            if (isPasswordMatch) {
                // create a token
                const token = await user.getJWT();

                // add the token into the cookie and send it through response
                res.cookie("token", token, {
                    expires: new Date(Date.now() + 8 * 3600000),
                });
                return res.status(200).send(user);
            } else {
                throw new Error("Invalid credentials");
            }
        } else {
            throw new Error("Invalid credentials");
        }

    } catch(error) {
        return res.status(400).send("ERROR: " + error.message);
    }
});

authRouter.post("/logout", async (req, res) => {
    try {
        return res.cookie("token", null, { expires: new Date(Date.now()) }).status(200).send("user logged out");
    } catch (error) {
        return res.status(400).send("ERROR: " + error.message);
    }
});

authRouter.patch("/forgotPassword", async (req, res) => {
    try {
        if (!validateForgotPasswordEditData(req)) {
            throw new Error("Invalid password edit request");
        }

        const { emailId } = req.body;

        const user = await User.findOne({
            emailId: emailId
        });

         req.body.password = await bcrypt.hash(req.body.password, 10);

        if (user) {
            await User.findByIdAndUpdate(user._id, {
                password: req.body.password
            });

            res.status(200).json({
                message: `${user.firstName}, your password updated successfully.`
            });
        } else {
            throw new Error("Invalid credentials");
        }
        
    } catch (error) {
        return res.status(400).send("ERROR: " + error.message);
    }
});

module.exports = authRouter;
