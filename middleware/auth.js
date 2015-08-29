var user = require('../models/user');

module.exports.checkUser = function (req, res, next) {	
	if(!req.session.user && req.session.user.isAdmin){
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