var express = require("express");
var router = express.Router();
var bcrypt = require("bcrypt");
const User = require("../../models/user");
const cookieParser = require("cookie-parser");
router.use(cookieParser());
const { v4: uuidv4 } = require("uuid");

router.post("/checkaccount", async (req, res) => {
    User.findOne({ email: req.body.email, name: req.body.name }).then(user => {
        if (user) {
            bcrypt.compare(req.body.password, user.password, (err, result) => {
                if (result) {
                    user.tokens.push(uuidv4());
                    user.save().then(user => {
                        if (req.cookies.moremath) {
                            let newCookie = {
                                "username": user.name,
                                "token": user.tokens[user.tokens.length - 1]
                            }
                            let combined = req.cookies.push(newCookie);
                            res.cookie("moremath", JSON.stringify(combined), { maxAge: 31556952000 });
                        } else {
                            res.cookie("moremath", JSON.stringify([{
                                "username": user.name,
                                "token": user.tokens[user.tokens.length - 1]
                            }]), { maxAge: 31556952000 });
                        }
                    });
                } else {
                    res.send("Incorrect password.");
                };
            });
        } else {
            res.send("No user with that email and username found.");
        };
    });

});

module.exports = router;