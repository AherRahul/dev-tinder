const express = require("express");
const userAuth = require("../middleware/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const requestRouter = express.Router();

requestRouter.post("/send/:status/:toUserId", async (req, res) => {
    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;
        const allowedStatusType = ["intrested", "ignored"];

        if (!allowedStatusType.includes(status)) {
            return res.status(400).json({
                message: "Invalid status type: " + status,
            })
        }

        const toUser = await User.findById(toUserId);

        if(!toUser) {
            return res.status(404).json({ message: "User not exists" });
        }

        // If there is an existing connectionRequest
        const exsistingConnectionRequest = await ConnectionRequest.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId },
            ],
        });

        if (exsistingConnectionRequest) {
            return res.status(400).json({ message: "ERROR: Connection request already sent" });
        }

        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        });

        const connectionData = await connectionRequest.save();

        return res.status(200).json({
            message: "connection status updated successfully",
            data: connectionData
        });
    } catch (error) {
        return res.status(400).send("ERROR: " + error.message);
    }
});

requestRouter.post("/review/:status/:requestId", async (req, res) => {
    try {
        const loggedInUser = req.user;
        const requestId = req.params.requestId;
        const status = req.params.status;

        const allowedStatusType = ["accepted", "rejected"];

        if (!allowedStatusType.includes(status)) {
            return res.status(400).json({
                message: "Invalid status type: " + status,
            })
        }

        const connectionRequest = await ConnectionRequest.findOne({
            _id: requestId,
            toUserId: loggedInUser._id,
            status: "intrested"
        });

        if(!connectionRequest) {
            return res.status(404).json({
                message: "Connection request not found"
            })
        }
        
        connectionRequest.status = status;

        const data = await connectionRequest.save();

        return res.status(200).json({
            message: "Connection reqest " + status,
            request: data,
        })
    } catch (error) {
        return res.status(400).send("ERROR: " + error.message);
    }
});

module.exports = requestRouter;
