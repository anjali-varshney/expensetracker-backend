const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const fetchuser = require('../middleware/fetchuser');
const jwt = require('jsonwebtoken');
// express-validator is a set of express.js middlewares that wraps validator.js validator and sanitizer functions.
const { body, validationResult } = require('express-validator');

const dotenv = require('dotenv');
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

/* 
    TODO: Create a User using POST "/api/auth/createuser"
    *No Login required
*/
router.post('/createuser', [
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password must be at least 8 characters long').isLength({ min: 8 }),
], async (req, res) => {
    // To capture the response state at the client side.
    let isValid = false;

    //Returns bad request and errors if any validation fails
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ isValid, error: errors.array() });
    }
    try {
        //Check if the user with this email already exists
        let user = await User.findOne({ email: req.body.email });
        if (user)
            return res.status(400).json({ isValid, error: "This email is already registered" })

        const salt = await bcrypt.genSalt(10);
        const securePassword = await bcrypt.hash(req.body.password, salt);

        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: securePassword
        });
        const data = {
            user: {
                id: user.id
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET);
        isValid = true;
        res.json({ isValid, authToken })
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ isValid, error: "Internal error occurred !" });
    }
})


/* 
    TODO: Create a User using POST "/api/auth/login"
    *No Login required
*/
router.post('/login', [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password cannot be blank').exists()
], async (req, res) => {
    // To capture the response state at the client side.
    let isValid = false;

    //Returns bad request and errors if any validation fails
    const errors = validationResult(req);
    if (!errors.isEmpty())
        return res.status(400).json({ isValid, error: errors.array() });

    try {
        const { email, password } = req.body;
        let user = await User.findOne({ email });
        if (!user)
            return res.status(400).json({ isValid, error: "Please enter correct credentials" });
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch)
            return res.status(400).json({ isValid, error: "Please enter correct credentials" });
        const data = {
            user: {
                id: user.id
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET);
        isValid = true;
        res.json({ isValid, authToken })
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ isValid, error: "Internal server error occurred !" });
    }
})

/* 
    TODO: Get Logged in user details using GET "/api/auth/getuser"
    *Login required
*/
router.get('/getuser', fetchuser, async (req, res) => {
    // To capture the response state at the client side.
    let isValid = false;
    try {
        userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        isValid = true;
        res.json({isValid, user});

    } catch (error) {
        console.error(error.message);
        res.status(500).json({isValid, error:"Internal server error occurred !"});
    }
})
module.exports = router