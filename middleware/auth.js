var user = require('../models/user');
var conf = require('../conf.json');

module.exports.checkUser = function (req, res, next) {	
	if(!req.session.user || req.session.user.isAdmin || req.session.user.isBlocked || (conf.checkIpOnLogin && !!~req.session.user.indexOf(req.connection.remoteAddress))){
		console.log("not user!!!!!!")
		res.status(401).render('401', {isAdmin:false});
	}else next();
}

module.exports.checkAdmin =  function (req, res, next) {
	if(!req.session.user || !req.session.user.isAdmin){
		console.log("not admin!!!!!!")
		res.status(401).render('401', {isAdmin:true});
	}else next();
};