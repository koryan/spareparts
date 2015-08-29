/*
 * GET home page.
 */

exports.index = function(req, res){  
  res.render('secure', {user:{login:req.session.user.login, lastLogin:req.session.user.lastLogin}});
};

exports.login = function(req, res){
  res.render('login');
};

exports.admin = function(req, res){
  res.render('admin');
};

exports.p404 = function(req, res){
  res.status(404).render('404');
};



exports.partials = function (req, res) {
  var name = req.params.name;
  res.render('partials/' + name);
};