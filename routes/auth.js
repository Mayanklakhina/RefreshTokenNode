const express = require('express');
const router = express.Router(); 

const User = require('../models/User');

const bcrypt = require('bcryptjs');
const {createTokens} = require('../tokensFunc/createToken');

const {signUpValidation, loginValidation} = require('../validation');

router.post('/signup', async(req, res)=> {
        //validation of data
        const {error} = signUpValidation(req.body);
        if (error) return res.status(400).json({ error: true, message: error.details[0].message });
  
       // checking if email exists
       const emailExist   = await User.findOne({email : req.body.email});
       if(emailExist) return res.status(400).send("This Email Id already exists");
  
      // hash the password
          const salt  =  await bcrypt.genSalt(10);
          const hashedPassword  = await bcrypt.hash(req.body.password, salt);
  
      // create a user
      const newUser = new User({
          username : req.body.username,
          email : req.body.email,
          password : hashedPassword
      })
  
      // save to the db
      try {
         const userData   = await newUser.save();
         res.status(201).send("Success!");
      }
      catch(err) {
          res.status(500).send(err);
      }
})

router.post('/login', async(req, res)=> {
    //validation of data
    const {error} = loginValidation(req.body);
    if(error) return res.status(400).send(error);

   //  checking if email exists or not
   const user = await User.findOne({email : req.body.email });
   if(!user) return res.status(400).send({msg : "email id does not exist"});

   // password matching
   const validPassword = await bcrypt.compare(req.body.password, user.password);
   if(!validPassword) return res.status(500).send({msg : "Invalid credentials"});

   const { accessToken, refreshToken } = await createTokens(user);

   res.status(200).json({accessToken, refreshToken, message: "Logged in sucessfully" });
})

module.exports = router;