var express = require("express");
const User = require("../../models/user");
var router = express.Router();
const cookieParser = require("cookie-parser");
router.use(cookieParser());

router.post("/start", (req, res) => {
    User.findOne({ session: req.cookies.current })
        .then(user => {
            if (user) {
                user.active = true
                user.save()
                res.send("success")
            }
        })
})

module.exports = router