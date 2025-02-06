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
}

module.exports = validateSignupData;