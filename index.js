const express = require('express')
const fs = require('fs')
const app = express()
const User = require("./models/user");
const ejs = require('ejs')
const { v4: uuidv4 } = require("uuid");
const cors = require('cors')
const cookieParser = require("cookie-parser");
const mongoose = require('mongoose')
app.use(express.static(__dirname + '/public'));
app.use(cors())
app.set('view engine', 'ejs')
app.use(cookieParser());

mongoose.connect('mongodb://localhost:27017/moremath', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))

fs.readdir('./routes/users/', (err, files) => {
  files.forEach(file => {
    app.use('/users', require('./routes/users/' + file));
  });
});

fs.readdir('./routes/math/', (err, files) => {
  files.forEach(file => {
    app.use('/math', require('./routes/math/' + file));
  });
});

app.use(express.urlencoded({
  extended: true
}))

app.get('/', (req, res) => {
  if (req.cookies.moremath) {
    let users = []
    findUsers()
    async function findUsers() {
      let cookies = await JSON.parse(req.cookies.moremath);
      for (let q = 0; q < cookies.length; q++) {
        await User.findOne({ token: cookies[q].token }).then(async user => {
          if (user) {
            await users.push(user)
          }
        })
        if (q == cookies.length - 1) {
          res.render('index', { users: users })
        }
      }
    }
  }
});

app.get('/jquery.js', (req, res) => {
  res.sendFile('/jquery.js', { root: __dirname });
});

app.get('/bootstrap.js', (req, res) => {
  res.sendFile('/bootstrap.js', { root: __dirname });
});

app.get('/bootstrap.css', (req, res) => {
  res.sendFile('/bootstrap.css', { root: __dirname });
});

app.get('/practice', (req, res) => {
  if (req.cookies.current) {
    User.findOne({ token: req.cookies.current }).then(user => {
      if (user) {
        res.render('practice', { user: user })
      } else {
        res.redirect('/')
      }
    })
  } else {
    res.redirect('/')
  }
});

app.get('/complete', (req, res) => {
  if (req.cookies.current) {
    User.findOne({ token: req.cookies.current }).then(user => {
      if (user) {
        res.render('complete', { user: user })
      } else {
        res.redirect('/')
      }
    })
  } else {
    res.redirect('/')
  }
});

app.get('/signup', (req, res) => {
  res.sendFile('/signup.html', { root: __dirname });
});

app.get('/login', (req, res) => {
  res.sendFile('/login.html', { root: __dirname });
});

app.post('/start', (req, res) => {
  if (req.cookies.moremath) {
    User.findOne({ token: req.body.token }).then(user => {
      if (user) {
        user.session = uuidv4();
        user.save()
        res.cookie('current', user.session, { maxAge: 900000, httpOnly: true });
        res.send({
          success: true
        })
      }
    })
  }
});

app.listen(80)