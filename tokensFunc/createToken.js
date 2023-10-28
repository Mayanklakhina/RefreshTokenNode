const jwt = require('jsonwebtoken');

const UserToken = require('../models/UserToken');

const createTokens = async (user) => {
    try {
        const payload = { _id: user._id };
        const accessToken = jwt.sign(
            payload,
            process.env.ACCESS_PRIVATE_KEY,
            { expiresIn: "15m" }
        );
        const refreshToken = jwt.sign(
            payload,
            process.env.REFRESH_PRIVATE_KEY,
            { expiresIn: "30d" }
        );

        const userToken = await UserToken.findOne({ userId: user._id });
        if (userToken) await userToken.remove();

        await new UserToken({ userId: user._id, token: refreshToken }).save();
        return { accessToken, refreshToken };
    } catch (error) {
        throw error;
    }
};

module.exports.createTokens = createTokens;