const express = require('express');
const router = express.Router();
const passport = require('passport');

//since it in routes folder=> http://localhost:3000/auth/google/ => disregard auth main folder => '/google/'


router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    // Successful authentication, redirect
    res.redirect('/dashboard');
  });

router.get('/verify',(req,res)=>{
  if(req.user){
    console.log(req.user);
  }else{
    console.log('not auth');
  }
});

router.get('/logout',(req,res)=>{
  req.logout();
  res.redirect('/');
});


module.exports = router;

