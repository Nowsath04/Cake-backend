const jwt = require("jsonwebtoken")
const createJwt = (res, user) => {
    const token = jwt.sign({ userId: user._id }, process.env.SECRET_key, { expiresIn: process.env.JWT_EXPIERD_DATE })
    return res.cookie("token", token, {
        path: "/",
        httpOnly: true,
    }).status(200).json({
        success: true,
        user,
        token
    })


}

module.exports = createJwt