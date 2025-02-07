const express = require("express");
const userAuth = require("../middleware/auth");

const requestRouter = express.Router();

requestRouter.post("/connection/:userId", userAuth, async (req, res) => {
    try {
        res.status(200).send("Connection request made");
    } catch (error) {
        res.status(400).send("ERROR: " + error.message);
    }
});

module.exports = requestRouter;
