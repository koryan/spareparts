var user = require('../models/user');

module.exports.search = function (req, res, next) {		
	user.log.write(req.session.user.login, {action:"search", ip:req.connection.remoteAddress, params: req.body.articuls.join(', ')}, function(err){
		if(err){return next(err);}
		next();
	})
}
module.exports.send = function (req, res, next) {		
	user.log.write(req.session.user.login, {action:"send",  ip:req.connection.remoteAddress, params: req.body.query}, function(err){
		if(err){return next(err);}
		next();
	})
}


