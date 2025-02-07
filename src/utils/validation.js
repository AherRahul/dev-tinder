const validatior = require("validator");

const validateSignupData = (req) => {
    const { firstName, lastName, emailId, password } = req.body;

    if (validatior.isEmpty(firstName) || !firstName) {
        throw new Error("First name is not valid");
    } else if (validatior.isEmpty(lastName) || !lastName) {
        throw new Error("last name is not valid");
    } else if (!validatior.isEmail(emailId)) {
        throw new Error("Invalid email address");
    } else if (!validatior.isStrongPassword(password)) {
        throw new Error("Password is not strong");
    }
};

const validateProfileEditData = (req) => {
    const allowedEditFields = [
        "firstName",
        "lastName",
        "photo",
        "gender",
        "age",
        "skills",
        "description"
    ];

    return Object.keys(req.body).every((field) => allowedEditFields.includes(field));
};

const validatePasswordEditData = (req) => {
    const allowedEditFields = [
        "oldPassword",
        "password",
    ];

    return Object.keys(req.body).every((field) => allowedEditFields.includes(field));
};

const validateForgotPasswordEditData = (req) => {
    const allowedEditFields = [
        "emailId",
        "password"
    ];

    return Object.keys(req.body).every((field) => allowedEditFields.includes(field));
};

module.exports = { 
    validateSignupData,
    validateProfileEditData,
    validatePasswordEditData,
    validateForgotPasswordEditData
};