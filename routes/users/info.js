var express = require("express");
var data = require('../../accounts.json')
var router = express.Router();
var bcrypt = require("bcrypt");
const jsonwt = require("jsonwebtoken");
var passport = require("passport");
require('../../passport')(passport)
const key = process.env['key']

router.post("/test", passport.authenticate("jwt", { session: false }), (req, res) => {

  })

module.exports = router