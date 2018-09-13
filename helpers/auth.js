module.exports = {
  ensureAuthenticated: function(req,res,next){
    if(req.isAuthenticated()){
      return next();
    }else{
    res.redirect('/');
    }
  },
  ensureGuest: function(req,res,next){
    if(req.isAuthenticated()){
      return res.redirect('/dashboard')
    }else{
     return next();
    }
  }
}