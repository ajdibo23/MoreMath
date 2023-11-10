const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
var data = require('../../accounts.json')
const fs = require('fs')
require('dotenv').config()
var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.key
module.exports = passport => {
  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
    // data = []
     fs.writeFileSync('accounts.json', JSON.stringify(data, null, "\t"));
      for (var q = 0; q < data.length; q++) {
        console.log(data[q],jwt_payload.name)
        if (data[q].name == jwt_payload.name) {
          if (data[q].password == jwt_payload.password) {
            return done(null, data[q]);
          }
        }
      }
    })
  );
};