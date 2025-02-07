// console.log("Ganpati bappa moraya..!!");
const express = require("express");
const connectDB = require('./config/database');
const cookieParser = require('cookie-parser');
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/requests");


// instantiate express
const app = express();


// parse application/json
app.use(express.json());
app.use(cookieParser());

app.use("/auth", authRouter);
app.use("/profile", profileRouter);
app.use("/request", requestRouter);


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
