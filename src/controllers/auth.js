const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

const User = require('../models/user');

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: 'THISISTHEAPIKEY-nodemailer-sendgrid-transport',
    },
  })
);

exports.getLogin = (req, res) => {
  let message = req.flash('error');
  if (message.length > 0) {
    [message] = message;
  } else {
    message = null;
  }
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    errorMessage: message,
  });
};

exports.getSignup = (req, res) => {
  let message = req.flash('error');
  if (message.length > 0) {
    [message] = message;
  } else {
    message = null;
  }
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    errorMessage: message,
  });
};

exports.postLogin = (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        req.flash('error', 'Invalid email or password.');
        return res.redirect('/login');
      }
      bcrypt
        .compare(password, user.password)
        .then((doMatch) => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save((err) => {
              if (err) {
                console.error(err);
              }
              res.redirect('/');
            });
          }
          req.flash('error', 'Invalid email or password.');
          res.redirect('/login');
        })
        .catch((error) => {
          console.error(error);
          res.redirect('/login');
        });
    })
    .catch(console.error);
};

exports.postSignup = (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .then((userDoc) => {
      if (userDoc) {
        req.flash('error', 'E-Mail already exists, please pick a different one.');
        return res.redirect('/signup');
      }
      return bcrypt
        .hash(password, 12)
        .then((hashedPassword) => {
          const user = new User({
            email,
            password: hashedPassword,
            cart: { items: [] },
          });
          return user.save();
        })
        .then(() => {
          res.redirect('/login');
          return transporter.sendMail({
            to: email,
            from: 'shop@nodejs-complete-guide.com',
            subject: 'Signup succeeded!',
            html: '<h1>You successfully signed up :)</h1>',
          });
        })
        .catch(console.error);
    })
    .catch(console.error);
};

exports.postLogout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
    }
    res.redirect('/');
  });
};
