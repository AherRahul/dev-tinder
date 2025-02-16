const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
    try {
        const {token} = req.cookies;

        const decodedObj = await jwt.verify(token, "DVE@Tinder$790");
        const { _id } = decodedObj;

        const user = await User.findById(_id);

        if (!user) {
            throw new Error("Please log in to access the data");
        }

        req.user = user;
        
        next();
    } catch (error) {
        res.status(400).send("ERROR: " + error.message);
    }
};

module.exports = userAuth;