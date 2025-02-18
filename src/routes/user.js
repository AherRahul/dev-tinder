const express = require("express");
const userAuth = require("../middleware/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const userRouter = express.Router();

const USER_SAFE_DATA = "firstName lastName photo skills age gender description"

// get all pending connection request for logged in user
userRouter.get("/request/received", userAuth, async(req, res) => {
    try {
        const loggedInUser = req.user;

        const requests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "intrested",
        }).populate("fromUserId", "firstName lastName photo skills");
        // }).populate("fromUserId", ["firstName", "lastName"]);
        
        if (requests.length === 0) {
            return res.status(404).json({
                message: "No requests found for user " + loggedInUser.firstName + " " + loggedInUser.lastName,
            });
        }

        return res.status(200).json({
            message: requests.length + " new request found",
            data: requests,
        });
    } catch (error) {
        return res.status(500).send("ERROR: " + error.message);
    }
});

userRouter.get("/connections", userAuth, async(req, res) => {
    try {
        const loggedInUser = req.user;
        
        const connections = await ConnectionRequest.find({
            $and: [
                {
                    $or: [
                        { fromUserId: loggedInUser._id },
                        { toUserId: loggedInUser._id },
                    ],
                },
                {
                    status: "accepted",
                }
            ]
        })
        .populate("fromUserId", USER_SAFE_DATA)
        .populate("toUserId", USER_SAFE_DATA);


        if (connections.length === 0) {
            return res.status(404).json({
                message: "No user connection found",
            });
        }

        const data = connections.map((row) => {
            if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
                return row.toUserId;
            }    
            return row.fromUserId;
        });

        return res.status(200).json({
            message: "list of connections",
            data: data,
        });
    } catch (error) {        
        return res.status(500).send("ERROR: " + error.message);
    }
});

userRouter.get("/feed", userAuth, async (req, res) => {
    try {
      const loggedInUser = req.user;
  
      const page = parseInt(req.query.page) || 1;
      let limit = parseInt(req.query.limit) || 10;
      limit = limit > 50 ? 50 : limit;
      const skip = (page - 1) * limit;
  
      const connectionRequests = await ConnectionRequest.find({
        $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
      }).select("fromUserId  toUserId");
  
      const hideUsersFromFeed = new Set();
      connectionRequests.forEach((req) => {
        hideUsersFromFeed.add(req.fromUserId.toString());
        hideUsersFromFeed.add(req.toUserId.toString());
      });
  
      const users = await User.find({
        $and: [
          { _id: { $nin: Array.from(hideUsersFromFeed) } },
          { _id: { $ne: loggedInUser._id } },
        ],
      })
        .select(USER_SAFE_DATA)
        .skip(skip)
        .limit(limit);
  
      res.json({ data: users });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
});


module.exports = userRouter;