const mongoose = require("mongoose");

const EmailVerificationSchema = new mongoose.Schema({
    userid: {
        type: String,
        required: true

    },
    OTP: {
        type: String,
        required: true
    },
    createdat: {
        type: Date,
        required: true
    },
    expiresAt: {
        type: Date,
        required: true
    }

})

const EmailVerificationModel = mongoose.model("EmailVerificationModel", EmailVerificationSchema)
module.exports = EmailVerificationModel