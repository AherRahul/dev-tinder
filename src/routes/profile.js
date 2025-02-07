const express = require("express");
const userAuth = require("../middleware/auth");
const { validateProfileEditData, validatePasswordEditData } = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require('bcrypt');

const profileRouter = express.Router();

profileRouter.get("/view", userAuth, async (req, res) => {
    try {
        res.status(200).send(req.user);
    } catch (error) {
        res.status(400).send("ERROR: " + error.message);
    }
});

profileRouter.patch("/edit", userAuth, async (req, res) => {
    try {
        if (!validateProfileEditData(req)) {
            throw new Error("Invalid edit request");
        }

        const user = await User.findByIdAndUpdate(req.user._id, req.body, {
            returnDocument: "after"
        });

        res.status(200).json({
            message: `${user.firstName}, your profile updated successfully.`,
            user: user
        });
    } catch (error) {
        res.status(400).send("ERROR: " + error.message);
    }
});

profileRouter.patch("/password/edit", userAuth, async (req, res) => {
    try {
        if (!validatePasswordEditData(req)) {
            throw new Error("Invalid password edit request");
        }
        
        const isValidPassword = await bcrypt.compare(req.body.oldPassword, req.user.password);

        if (!isValidPassword) {
            throw new Error("Password not matching");
        }

        // encrypt the password
        req.body.password = await bcrypt.hash(req.body.password, 10);

        const user = await User.findByIdAndUpdate(req.user._id, req.body, {
            returnDocument: "after"
        });

        res.status(200).json({
            message: `${user.firstName}, your password updated successfully.`,
            user: user
        });
    } catch (error) {
        res.status(400).send("ERROR: " + error.message);
    }
});

module.exports = profileRouter;
