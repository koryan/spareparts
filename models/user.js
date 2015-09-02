var moment = require("moment");
var conf = require('../conf.json');
var	db = require('riak-js')({host: conf.riak.host, port: conf.riak.port});

var crypto = require('crypto');

module.exports.auth = function(login, password, ip, cb){
	console.log(login, password)
	if(login == "admin" && password =="pass"){		
		cb(null, {isAdmin:true})
	}
	else{
		get(login, function(err, user){
			if(err){cb(err);return;}
			if(!user){cb("notFound");return;}
			if(conf.checkIpOnLogin && user.ip.indexOf(ip) === -1){cb("wrongIp");return;}
			if(user.isBlocked){cb("blocked");return;}
			if(crypto.createHash('md5').update(password).digest('hex') == user.password){
				user.lastLogin = new Date().getTime();
				db.save(conf.riakBuckets.users, user.login, user, function(err, rslt) {
			        delete user.password;
					cb(null, user)
			    });
			    return;				
			};
			cb("wrongPass")
		})
	} 
}

var get = function(login, cb){
	db.get(conf.riakBuckets.users, login,  function(err, rslt){
		if(err){
			if(err.notFound){
				cb(null, null);
				return;
			}			
			cb(err);
			return;
		}
		cb(null, rslt)
	})
}

var getList = function(cb){
	db.getAll(conf.riakBuckets.users, function(err, data){
		for(userI in data){
			delete data[userI].password
		}
		if(err){
			cb(err, data);
			return;
		}
		cb(null, data)
	})  
}

module.exports.get = get

module.exports.create = function(newUser, cb){
	get(newUser.login,  function(err, rslt){
		console.log("after get", err, rslt)
		if(err){
			cb(err);
			return;
		}
		if(rslt){
			cb(null, "exists");
			return;
		}
		
		newUser.password = crypto.createHash('md5').update(newUser.password).digest('hex')

		db.save('users', newUser.login, newUser, function(err, rslt) {
			console.log("end saving")
	        cb(err, rslt);
	    });
	})
}

module.exports.save = function(user, cb){	
	console.log(user)
	get(user.login,  function(err, rslt){		
		if(err){
			cb(err);
			return;
		}
		if(!rslt){
			cb(null, "user not exists");
			return;
		}
		
		for(key in user){
			if(user[key] !== "")rslt[key] = user[key];
		}

		db.save(conf.riakBuckets.users, user.login, rslt, function(err, rslt) {
			console.log("end saving")
	        cb(err, rslt);
	    });
	})
}

module.exports.del = function(login, cb){	
	db.remove(conf.riakBuckets.users, login, function(err, rslt) {
        cb(err, rslt);
    });	
}

module.exports.count = function(cb){
	getList(function(err, usersList){
		if(err){cb(err);return;}
		cb(null, usersList.length)
	})
}

module.exports.getList = getList;




