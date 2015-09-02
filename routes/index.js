var moment = require("moment");
/*
 * GET home page.
 */

exports.index = function(req, res){  
  res.render('secure', {user:{fio:req.session.user.fio, lastLogin:moment(req.session.user.lastLogin).format("DD.MM.YYYY HH:mm:ss")}});
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