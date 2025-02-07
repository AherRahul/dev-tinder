// console.log("Ganpati bappa moraya..!!");
const express = require("express");
const connectDB = require('./config/database');
const User = require('./models/user');
const validateSignupData = require("./utils/validation");
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const userAuth = require("./middleware/auth");

// instantiate express
const app = express();

// parse application/json
app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
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
    
        res.status(200).send("User added successfully");
    } catch (error) {
        res.status(400).send("ERROR: " + error.message);
    }
});

app.post("/login", async (req, res) => {
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
                res.status(200).send(user);
            } else {
                throw new Error("Invalid credentials");
            }
        } else {
            throw new Error("Invalid credentials");
        }

    } catch(error) {
        res.status(400).send("ERROR: " + error.message);
    }
});

app.get("/profile", userAuth, async (req, res) => {
    try {
        res.status(200).send(req.user);
    } catch (error) {
        res.status(400).send("ERROR: " + error.message);
    }
});


// connecting to DB first and then starting the server
connectDB().then(() => {
    console.log("DataBase connected successfully");

    // launching server on port 3000
    app.listen(3000, () => {
        console.log("server started");
    });
}).catch((error) => {
    console.error("DataBase cannot be connected.");
});


