const mongoose = require('mongoose');
const validatior = require("validator");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
        minLength: 4,
        maxLength: 50,
    },
    lastName: {
        type: String,
        trim: true,
        minLength: 4,
        maxLength: 50,
    },
    emailId: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        trim: true,
        minLength: 4,
        maxLength: 50,
        validate(value) {
            if (!validatior.isEmail(value)) {
                throw new Error("Invalid email address");
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    age: {
        type: String,
        trim: true,
        min: 18,
        max: 100,
    },
    gender: {
        type: String,
        trim: true,
        validate(value) {
            if(!["male", "female", "other"].includes(value)) {
                throw new Error("Please select specific gender");
            }
        }
    },
    photo: {
        type: String,
        trim: true,
        validate(value) {
            if (!validatior.isURL(value)) {
                throw new Error("Invalid photo URL");
            }
        }
    },
    skills: {
        type: [String],
        validate(val) {
            if (val.length > 10) {
                throw new Error("Only 10 skills are allowed");
            }
        }
    },
    description: {
        type: String,
        default: "This is the default description",
        trim: true,
    }
}, { timestamps: true });

userSchema.methods.getJWT = async function() {
    const user = this;

    const token = await jwt.sign({ _id: user._id }, "DVE@Tinder$790", { expiresIn: "1d" });

    return token;
}

userSchema.methods.validatePassword = async function (password) {
    const user = this;

    return await bcrypt.compare(password, user.password);
}

const User = mongoose.model("User", userSchema);

module.exports = User;
