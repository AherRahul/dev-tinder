const mongoose = require("mongoose");


const connectDB = async () => {
    await mongoose.connect(
        "mongodb+srv://systemdesigncourses:EoKCOW7d10dgo96p@devtinder.skj1h.mongodb.net/devTinder"
    );
}

module.exports = connectDB;