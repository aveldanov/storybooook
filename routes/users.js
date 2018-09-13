const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Story = mongoose.model('stories');
const User = mongoose.model('users');
const {ensureAuthenticated, ensureGuest} = require('../helpers/auth');
 
// Get all users
router.get('/', (req, res) => {
  User.find({})
  .populate('stories')
  .then(users => {
    res.render('users/index', {
      users: users
    });
    console.log(users)
  });
});
 
module.exports = router;