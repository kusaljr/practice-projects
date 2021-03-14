const isLoggedIn = (req, res, next)=>{
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/articles/");
}

module.exports = isLoggedIn