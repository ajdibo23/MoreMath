var express = require("express");
var bannedwords = require('../../bannedwords.json')
var data = require('../../accounts.json')
var uuid = require('uuid');
var fs = require('fs')
var router = express.Router();
var bcrypt = require("bcrypt");
const jsonwt = require("jsonwebtoken");
var passport = require("passport");
require('../../passport')(passport)
const saltRounds = 10;
const key = process.env['key']

router.post('/makenewaccount', (req, res) => {
    if (req.body.name && req.body.password && req.body.email) {
        var truth = false
        for (var b = 0; b < bannedwords.length; b++) {
            if (req.body.name.indexOf(bannedwords[b]) == -1) {
            } else {
                truth = true
            }
        }
        if (truth == true) {
            res.send("namedupe")
        } else {
            var name = req.body.name
            if (req.body.name == null) {
                res.send('namedupe')
            } else {
                var time = Date.now()
                var checker = false
                for (var q = 0; q < data.length; q++) {
                    if (data[q].name == req.body.name) {
                        checker = true
                    } else {
                        checker = false
                    }
                }
                if (checker == true) {
                    res.send('namedupe')
                }
                if (checker == false) {
                    bcrypt.hash(req.body.password, saltRounds, async (err, hash) => {
                        var newUser = {
                            "name": name,
                            "timecreated": time,
                            "email": req.body.email,
                            "badges": [],
                            "password": hash,
                            "id": uuid.v1(),
                            "math": "+",
                            "progress": ["0+0","0+1","0+2","0+3","0+4","0+5","0+6","0+7","0+8","0+9","1+0","1+1","1+2","1+3","1+4","1+5","1+6","1+7","1+8","1+9","2+0","2+1","2+2","2+3","2+4","2+5","2+6","2+7","2+8","2+9","3+0","3+1","3+2","3+3","3+4","3+5","3+6","3+7","3+8","3+9","4+0","4+1","4+2","4+3","4+4","4+5","4+6","4+7","4+8","4+9","5+0","5+1","5+2","5+3","5+4","5+5","5+6","5+7","5+8","5+9","6+0","6+1","6+2","6+3","6+4","6+5","6+6","6+7","6+8","6+9","7+0","7+1","7+2","7+3","7+4","7+5","7+6","7+7","7+8","7+9","8+0","8+1","8+2","8+3","8+4","8+5","8+6","8+7","8+8","8+9","9+0","9+1","9+2","9+3","9+4","9+5","9+6","9+7","9+8","9+9"]
                        }
                        data.push(newUser)
                        fs.writeFileSync('accounts.json', JSON.stringify(data, null, "\t"));
                        saveData()
                        async function saveData() {
                            const payload = {
                                id: newUser.id,
                                name: newUser.name,
                                password: newUser.password,
                                email: newUser.email
                            };
                            jsonwt.sign(
                                payload,
                                key,
                                { expiresIn: "7d" },
                                (err, token) => {
                                    if (err) {
                                        console.log("Error is ", err.message);
                                    }
                                    res.json({
                                        success: true,
                                        token: "Bearer " + token
                                    })
                                })
                        }
                    })
                }
            }
        }
    } else {
        res.send("false")
    }
})

module.exports = router