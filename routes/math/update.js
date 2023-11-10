var express = require("express");
const User = require("../../models/user");
var router = express.Router();
const cookieParser = require("cookie-parser");
router.use(cookieParser());

router.post("/update", (req, res) => {
    User.findOne({ session: req.cookies.current })
        .then(user => {
            user.active = false
            let curr = req.body.right
            let other = []
            let wrong = []
            curr = curr.replace(/,/g, '],[');
            curr = curr.replace(/ /g, '+');
            curr = curr.replace(/]/g, '"]');
            curr = curr.replace(/\[/g, '["');
            curr = `[["${curr}"]]`
            curr = curr.replace(/ /g, '');
            curr = JSON.parse(curr)
            for (let q = 0; q < curr.length; q++) {
                if (curr[q][0] == '') { } else {
                    user.completed.push(curr[q][0])
                    other.push(curr[q][0])
                }
            }
            curr = req.body.wrong
            curr = curr.replace(/,/g, '],[');
            curr = curr.replace(/ /g, '+');
            curr = curr.replace(/]/g, '"]');
            curr = curr.replace(/\[/g, '["');
            curr = `[["${curr}"]]`
            curr = curr.replace(/ /g, '');
            curr = JSON.parse(curr)
            for (let q = 0; q < curr.length; q++) {
                if (curr[q][0] == '') { } else {
                    wrong.push(curr[q][0])
                }
            }
            user.reports.push({
                "completed": other,
                "wrong": wrong,
                "avgtime": req.body.avgTime,
            })
            user.save()
            res.send({
                success: true,
                error: false
            })
        })
})

module.exports = router