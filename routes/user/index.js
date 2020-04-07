const express = require('express');
const router = express.Router();
const User = require('../../models/user');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../../config/database');
const configNotification = require('../../config/notification');
const axios = require('axios');

const randomOrTempPasswordGenerate = function (max, min) {
  var passwordChars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz#@!%&()/";
  var randPwLen = Math.floor(Math.random() * (max - min + 1)) + min;
  var randPassword = Array(randPwLen).fill(passwordChars).map(function (x) { return x[Math.floor(Math.random() * x.length)] }).join('');
  console.log("signing user temp password is : ", "TE" + randPassword + "MP");
  return "TE" + randPassword + "MP";
};

router.post("/adduser", passport.authenticate('jwt', { session: false }), async (req, res) => {
  console.log("user signup");
  const { username, firstname, lastname, phone, location, industry, ex, role, company } = req.body;
  // ADD VALIDATION
  User.findOne({ username: username }, (err, user) => {
    if (err) {
      console.log("User.js post error: ", err);
      res.json({
        error: `Something went wrong. Please try again.`
      });
    } else if (user) {
      res.json({
        error: `A user with the same email address already exists.`
      });
    } else {
      const tempPassword = randomOrTempPasswordGenerate(10, 8);
      const newUser = new User({
        username: username,
        password: tempPassword,
        firstname: firstname,
        lastname: lastname,
        phone: phone,
        ex: ex,
        location: location,
        role: role,
        company: company,
        industry: industry
      });
      User.addUser(newUser, async (err, savedUser) => {
        if (err) {
          console.log("User.js post error: ", err);
          return res.json({ error: `Something went wrong. Please try again.` });
        }
        // call Notifaction ''   server to server
        const notifactionObj = {
          "emailId": username,
          "subject": "Notificatio Via IMS",
          "tempPassword": tempPassword
        };

        let infoNotification = await axios.post(configNotification.url, notifactionObj);
        const resObj = {};
        var newUserObj = {};
        newUserObj._doc = savedUser;
        newUserObj.expiresIn = 604800;
        const token = jwt.sign(newUserObj, config.secret);
        // const token = jwt.sign(savedUser, config.secret, {
        //   expiresIn: 604800 //1 week
        // });
        resObj.token = token;
        resObj.userData = savedUser;
        resObj.infoNotification = infoNotification.data;
        console.log(resObj);
        res.json(resObj);
      });
    }
  });
});

//Authenticate
router.post('/login', (req, res, next) => {
  console.log('login ', req.body);
  const username = req.body.username;
  const password = req.body.password;

  User.getUserByUsername(username, (err, user) => {
    if (err) {
      return res.json({ success: false, msg: 'Something went wrong. Please try again' });
    };


    if (!user) {
      return res.json({ success: false, msg: 'The email or password you entered is incorrect.Please try again' });
    }
    User.comparePassword(password, user.password, (err, isMatch) => {
      if (err) throw err;
      if (isMatch) {
        var newUserObj = {};
        newUserObj._doc = user;
        newUserObj.expiresIn = 604800;

        const token = jwt.sign(newUserObj, config.secret);
        // const token = jwt.sign(user, config.secret, {
        //   expiresIn: 604800 //1 week
        // });
        res.json({
          success: true,
          token: 'JWT ' + token,
          user: {
            id: user._id,
            name: user.firstname + " " + user.lastname,
            username: user.username,
            userrole: user.role
            //password: user.password
          }
        });
      } else {
        return res.json({ success: false, msg: 'The email or password you entered is incorrect.Please try again' });
      }
    });
  });
});

//Profile
router.get('/profile', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  res.json({ user: req.user });

});

router.post("/changePassword", passport.authenticate('jwt', { session: false }), (req, res) => {
  const { tempPassword, newPassword, userName } = req.body;
  if (req.user) {
    User.findOne({ username: userName }, (err, user) => {
      if (err) {
        console.log("User.js post error: ", err);
        res.json({ msg: "no user to log out" });
      } else {
        var re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
        if (!re.test(newPassword)) {
          return res.json({
            msg:  'Please enter a password meeting the format requirements'
          });
        }
        user.password = newPassword;
        User.addUser(user, (err, savedUser) => {
          // user.save((err, savedUser) => {
          if (err) return res.json(err);
          res.json(savedUser);
        });
      }
    });
  } else {
    res.json({ msg: "no user to log out" });
  }
});

router.get("/", passport.authenticate('jwt', { session: false }), (req, res, next) => {
  console.log("===== user!!======");
  console.log(req.user);
  if (req.user) {
    res.json({ user: req.user });
  } else {
    res.json({ user: null });
  }
});

router.post("/logout", passport.authenticate('jwt', { session: false }), (req, res) => {
  if (req.user) {
    req.logout();
    res.json({ msg: "logging out" });
  } else {
    res.json({ msg: "no user to log out" });
  }
});
module.exports = router;