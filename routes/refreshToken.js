const express = require('express');
const jwt = require('jsonwebtoken');
const UserToken = require('../models/UserToken');
const {refreshTokenValidation} = require('../validation');
const {verifyRefreshToken} = require('../tokensFunc/verifyRefreshToken');

const router = express.Router();

// to generate new access token using refresh token
router.post('/generate', async(req, res)=>{
    const { error } = refreshTokenValidation(req.body);
    if (error) return res.status(400).json({message: error.details[0].message });

    verifyRefreshToken(req.body.refreshToken)
        .then(({ tokenDetails }) => {
            const payload = { _id: tokenDetails._id};
            const accessToken = jwt.sign(
                payload,
                process.env.ACCESS_PRIVATE_KEY,
                { expiresIn: "15m" }
            );
            res.status(200).json({accessToken, message: "Access token created successfully"});
        })
        .catch((error) => res.status(400).json(error));

})

// logout
router.delete('/', async(req, res)=> {
    try {
        const { error } = refreshTokenValidation(req.body);
        if (error)
            return res
                .status(400)
                .json({ error: true, message: error.details[0].message });

        const userToken = await UserToken.findOne({ token: req.body.refreshToken });
        if (!userToken)
            return res
                .status(200)
                .json({ error: false, message: "Logged Out Sucessfully" });

        await userToken.remove();
        res.status(200).json({ error: false, message: "Logged Out Sucessfully" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: true, message: "Internal Server Error" });
    }
});


module.exports = router;