// console.log("Ganpati bappa moraya..!!");
const express = require("express");
const connectDB = require('./config/database');
const cookieParser = require('cookie-parser');
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/requests");
const userRouter = require("./routes/user");
const cors = require("cors");

// instantiate express
const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));
// parse application/json
app.use(express.json());
app.use(cookieParser());

app.use("/auth", authRouter);
app.use("/profile", profileRouter);
app.use("/request", requestRouter);
app.use("/user", userRouter);


// connecting to DB first and then starting the server
connectDB().then(() => {
    console.log("DataBase connected successfully");

    // launching server on port 3000
    app.listen(port, () => {
        console.log("server started");
    });
}).catch((error) => {
    console.log(error);
    console.error("DataBase cannot be connected.");
});
