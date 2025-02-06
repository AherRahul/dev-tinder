// console.log("Ganpati bappa moraya..!!");
const express = require("express");
const connectDB = require('./config/database');
const User = require('./models/user');
const validateSignupData = require("./utils/validation");
const bcrypt = require('bcrypt');

// instantiate express
const app = express();

// parse application/json
app.use(express.json());

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
            const isPasswordMatch = await bcrypt.compare(password, user.password);

            if (isPasswordMatch) {
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

app.get("/feed", async (req, res) => {
    try {
        const users = await User.find({});

        res.status(200).send(users);
    } catch(error) {
        res.status(400).send("Something went wrong" + error.message);
    }
});

app.get("/user/findByEmail", async (req, res) => {
    try {
        const users = await User.find({ emailId: req.body.emailId });

        res.status(200).send(users);
    } catch(error) {
        res.status(400).send("Something went wrong" + error.message);
    }
});

app.get("/user/findByEmail/exact", async (req, res) => {
    try {
        // Send the first document which found first
        const users = await User.findOne({ emailId: req.body.emailId });

        res.status(200).send(users);
    } catch(error) {
        res.status(400).send("Something went wrong" + error.message);
    }
});

app.get("/user/:userId", async (req, res) => {
    try {
        // Send the first document which found first
        const user = await User.findById(req.params?.userId);

        res.status(200).send(user);
    } catch(error) {
        res.status(400).send("Something went wrong" + error.message);
    }
});

app.delete("/user/:userId", async (req, res) => {
    try {
        // const user = await User.findByIdAndDelete(userId);
        const user = await User.findByIdAndDelete({ _id: req.params?.userId });

        res.status(200).send("User deleted successfully: " + user);
    } catch (error) {
        res.status(400).send("Something went wrong" + error.message);
    }
});

app.patch("/user/:userId", async (req, res) => {
    try {
        const ALLOWED_UPDATES = [ "photoUrl", "about", "gender", "age", "skills", "photo"];

        const isUpdateAllowed = Object.keys(req.body).every((k) => 
            ALLOWED_UPDATES.includes(k)
        );
    
        if (!isUpdateAllowed) {
            throw new Error("Update not allowed");
        }

        if (req.body?.skills.length > 10) {
            throw new Error("Only 10 skills are allowed");
        }

        // const user = await User.findByIdAndUpdate(userId);
        const user = await User.findByIdAndUpdate({ _id: req.params?.userId }, req.body, {
            returnDocument: 'before',
            runValidators: true
        });

        res.status(200).send("User updated successfully: " + user);
    } catch (error) {
        res.status(400).send("Something went wrong: " + error.message);
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


