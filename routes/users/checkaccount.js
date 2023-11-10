var express = require("express");
var data = require('../../accounts.json')
var router = express.Router();
var bcrypt = require("bcrypt");
const jsonwt = require("jsonwebtoken");
var passport = require("passport");
require('../../passport')(passport)
const key = process.env['key']

router.post("/checkaccount", async (req, res) => {
    var newUser = {};
    newUser.name = req.body.name;
    newUser.password = req.body.password;
    var b;
    for (var q = 0; q < data.length; q++) {
        if (data[q].name == req.body.name || data[q].email == req.body.name) {
            b = q
      bcrypt.compare(
        req.body.password,
        data[q].password,
        async (err, result) => {
          if (err) {
            console.log("Error is", err.message);
          } else if (result == true) {
            const payload = {
              id: data[b].id,
              name: data[b].name,
              password: data[b].password
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
          } else {
            res.send({"error":"User Unauthorized Access"});
        }
        })
    }
    }
    });    
    
module.exports = router