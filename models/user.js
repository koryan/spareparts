var moment = require("moment")

module.exports.auth = function(req, res, cb){

	if(req.body.login == "admin" && req.body.password =="pass"){		
		cb(null, {isAdmin:true})
	}
	else if(req.body.login == "user" && req.body.password =="pass"){		
		cb(null, {login:"Вася", lastLogin: moment().format("DD.MM.YYYY HH:mm:ss")})
	}else{
		//
		cb()
	}
}

module.exports.register = function(req, res, cb){
	//Регистрация
}

module.exports.switchBlock = function(req, res, cb){
	//
}

module.exports.changePassword = function(req, res, cb){
	//
}



