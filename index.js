const express = require('express')
const fs = require('fs')
var data = require('./accounts.json')
const app = express()
var path = require('path');
var passport = require('passport')
app.use(passport.initialize());
const client = require('https');
app.use(express.static(__dirname + '/public'));
require('dotenv').config()

var users = {
    "dir": './routes/users/', // requires the / at the end
    "aftername": '/users'
  }
  fs.readdir(users.dir, (err, files) => {
    files.forEach(file => {
      app.use(users.aftername, require(users.dir + file));
    });
  });

  var math = {
    "dir": './routes/math/', // requires the / at the end
    "aftername": '/math'
  }
  fs.readdir(math.dir, (err, files) => {
    files.forEach(file => {
      app.use(math.aftername, require(math.dir + file));
    });
  });

  app.use(express.urlencoded({
    extended: true
  }))
  

app.get('/', (req, res) => {
    res.sendFile('/index.html', { root: __dirname });
});

app.get('/practice', (req, res) => {
    res.sendFile('/practice.html', { root: __dirname });
});

app.get('/signup', (req, res) => {
    res.sendFile('/signup.html', { root: __dirname });
});

app.get('/login', (req, res) => {
  res.sendFile('/login.html', { root: __dirname });
});
fs.writeFileSync('accounts.json', JSON.stringify(data, null, "\t"));
app.listen(80)