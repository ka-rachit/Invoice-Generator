const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Helper - Generate JWT
const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
};

// @desc     Register new User
// @route    POST /api/auth/register
// @access   Public

exports.registerUser = async (req, res) => {
    const {name, email, phone, password} = req.body;

    try {
        if (!name || (!email && !phone) || !password) {
            return res.status(400).json({message: "Please fill all the fields"});
        }

        // Check if user already exists
        if (email) {
            const userExists = await User.findOne({email});
            if (userExists) {
                return res.status(400).json({message: "User with this email already exists"});
            }
        }
        
        if (phone) {
            const userExists = await User.findOne({phone});
            if (userExists) {
                return res.status(400).json({message: "User with this phone number already exists"});
            }
        }

        // Create User
        const user = await User.create({name, email: email || "", phone: phone || "", password});

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({message: "Invalid User Data"});
        }
    } catch (error) {
        console.error("Register Error:", error);
        res.status(500).json({message: "Server Error"});
    }
};

// @desc     Login User
// @route    POST /api/auth/login
// @access   Public
exports.loginUser = async (req, res) => {
    const {email, phone, password} = req.body;

    try {
        let query = {};
        if (email) {
            query = {email};
        } else if (phone) {
            query = {phone};
        } else {
            return res.status(400).json({message: "Email or Phone is required"});
        }

        const user = await User.findOne(query).select("+password");

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id),

                businessName: user.businessName || "",
                address: user.address || "",
                phone: user.phone || "",
            });
        } else {
            res.status(401).json({message: "Invalid Credentials"});
        }
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({message: "Server Error"});
    }
};

// @desc     Login User
// @route    POST /api/auth/register
// @access   Private
exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,

            businessName: user.businessName || "",
            address: user.address || "",
            phone: user.phone || "",
        });
    } catch (error) {
        res.status(500).json({message: "Server Error"});
    }
};

// @desc     Login User
// @route    POST /api/auth/register
// @access   Private
exports.updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.name = req.body.name || user.name;
            user.businessName = req.body.businessName || user.businessName;
            user.address = req.body.address || user.address;
            user.phone = req.body.phone || user.phone;

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                businessName: updatedUser.businessName,
                address: updatedUser.address,
                phone: updatedUser.phone,
            });
        } else {
            res.status(500).json({message: "User Not Found"});
        }
    } catch (error) {
        res.status(500).json({message: "Server Error"});
    }
};
