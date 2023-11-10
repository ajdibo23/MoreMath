var express = require("express");
var router = express.Router();
var bcrypt = require("bcrypt");
const User = require("../../models/user");
const { v4: uuidv4 } = require("uuid");
const cookieParser = require("cookie-parser");
router.use(cookieParser());

router.post('/create', (req, res) => {
    if (req.body.name && req.body.password && req.body.email) {
        if (req.body.email.includes("@")) {
            if (!req.body.name.includes("<") && !req.body.name.includes(">")) {
                if (req.body.name.length < 20) {
                    User.findOne({ email: req.body.email, name: req.body.name }).then(user => {
                        if (user) {
                            res.send("A user with that email and username already exists.");
                        } else {
                            bcrypt.hash(req.body.password, 10, async (err, hash) => {
                                new User({
                                    "name": req.body.name,
                                    "email": req.body.email,
                                    "password": hash,
                                    "math": "+",
                                    "completed": [],
                                    "tokens": [uuidv4()],
                                    "progress": ["0+0", "0+1", "0+2", "0+3", "0+4", "0+5", "0+6", "0+7", "0+8", "0+9", "1+0", "1+1", "1+2", "1+3", "1+4", "1+5", "1+6", "1+7", "1+8", "1+9", "2+0", "2+1", "2+2", "2+3", "2+4", "2+5", "2+6", "2+7", "2+8", "2+9", "3+0", "3+1", "3+2", "3+3", "3+4", "3+5", "3+6", "3+7", "3+8", "3+9", "4+0", "4+1", "4+2", "4+3", "4+4", "4+5", "4+6", "4+7", "4+8", "4+9", "5+0", "5+1", "5+2", "5+3", "5+4", "5+5", "5+6", "5+7", "5+8", "5+9", "6+0", "6+1", "6+2", "6+3", "6+4", "6+5", "6+6", "6+7", "6+8", "6+9", "7+0", "7+1", "7+2", "7+3", "7+4", "7+5", "7+6", "7+7", "7+8", "7+9", "8+0", "8+1", "8+2", "8+3", "8+4", "8+5", "8+6", "8+7", "8+8", "8+9", "9+0", "9+1", "9+2", "9+3", "9+4", "9+5", "9+6", "9+7", "9+8", "9+9"]
                                }).save().then(user => {
                                    if (req.cookies.moremath) {
                                        let newCookie = {
                                            "username": user.name,
                                            "token": user.tokens[user.tokens.length - 1]
                                        }
                                        let combined = req.cookies.push(newCookie);
                                        res.cookie("moremath", JSON.stringify(combined), { maxAge: 31556952000 });
                                        res.send("success");
                                    } else {
                                        res.cookie("moremath", JSON.stringify([{
                                            "username": user.name,
                                            "token": user.tokens[user.tokens.length - 1]
                                        }]), { maxAge: 31556952000 });
                                        res.send("success");
                                    };
                                });
                            });
                        };
                    });
                } else {
                    res.send("Please enter a name that is less than 20 characters.");
                };
            } else {
                res.send(`Please don't use "<" or ">" in your name.`);
            };
        } else {
            res.send("Please enter a valid email address.");
        };
    };
});

module.exports = router;