var moment = require("moment");
var conf = require('../conf.json');
var	db = require('riak-js')({host: conf.riak.host, port: conf.riak.port});
var async = require('async');
var crypto = require('crypto');

module.exports.auth = function(login, password, ip, cb){
	if(login == conf.admin.login && password == conf.admin.password){		
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
				//log(user.login, {action:"login"}, function() {})
				log.write(login, {action:"login", ip: ip}, function(){})
				db.save(conf.riakBuckets.users, user.login, user, function() {});
				delete user.password;
				cb(null, user)
			    			
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

var log = {
	write: function(userLogin, logObj, cb){	
		var time = new Date().getTime();
		logObj.userLogin = userLogin;
		async.auto({
			getCommonKeys: function(callback){				
				db.get(conf.riakBuckets.usersLog, 'keys', function(err, data){
		    		if(err){
			    		if(err.notFound){
			    			callback(null, [])
			    		}else callback(err)
			    		return;
			    	}
			    	callback(null, data)
		    	})
			},
		    writeCommonKeys: ['getCommonKeys', function(callback, results){
		    	results.getCommonKeys.push(time)
		    	db.save(conf.riakBuckets.usersLog, 'keys', results.getCommonKeys, callback)
		    }],
		    writeCommon: function(callback){
				db.save(conf.riakBuckets.usersLog, time, logObj, callback)
		    },
		    getIndividual: function(callback){
		    	db.get(conf.riakBuckets.personalUsersLog, userLogin, function(err, data){
		    		if(err){
			    		if(err.notFound){
			    			callback(null, [])
			    		}else callback(err)
			    		return;
			    	}
			    	callback(null, data)
		    	})
		    },
		    writeIndividual: ['getIndividual', function(callback, results){
				results.getIndividual.push(""+time)
	    		db.save(conf.riakBuckets.personalUsersLog, userLogin, results.getIndividual, callback)
	    	}]
		}, cb)		
		
	},
	read: function(userLogin, page, cb){
		db.get(conf.riakBuckets.personalUsersLog, userLogin, function(err, data, meta){	

			if(err){
				if(err.notFound){cb(null, []);}else cb(err, data);
				return;
			}
			var total = data.length
			data = data.reverse();
			console.log("page", page)
			console.log(data)
			data = data.slice((page-1)*conf.individualLogsPerPage, page*conf.individualLogsPerPage);
			console.log("22222222", data)

			async.map(data, function(item, callback){
				db.get(conf.riakBuckets.usersLog, item, function(err, result){
					result.time = item;
					callback(err, result)
				});
			},function(err, dataX){
				cb(err, {data:dataX, total:total, perPage:conf.individualLogsPerPage})
			});			
		})
	},
	readAll: function(page, cb){
		db.get(conf.riakBuckets.usersLog, 'keys', function(err, data){	
			if(err){
				if(err.notFound){cb(null, []);}else cb(err, data);
				return;
			}
			var total = data.length
			data = data.reverse();
			data = data.slice((page-1)*conf.commonLogsPerPage, page*conf.commonLogsPerPage);
			var users = {};
			async.map(data, function(item, callback){
				db.get(conf.riakBuckets.usersLog, item, function(err, result){
					result.time = item;
					if((new Date().getTime() - result.time < 24*60*60*1000) && result.action=="search"){
						if(!users[result.userLogin])users[result.userLogin] = 0;
						users[result.userLogin]++;
					}
					callback(err, result)
				});
			},function(err, data){
				var usersOverLimit = [];
				for(var userLogin in users){
					//userDaySearchLimit
					if(users[userLogin] > conf.userDaySearchLimit)usersOverLimit.push(userLogin)
				}

				cb(err, {data:data, usersOverLimit: usersOverLimit, total:total, perPage:conf.commonLogsPerPage})
			});			
		})
	},
	getLastSearch: function(cb){
		db.get(conf.riakBuckets.usersLog, 'keys', function(err, data){	
			if(err){
				if(err.notFound){cb(null, []);}else cb(err, data);
				return;
			}
			data.reverse()
			if(data.length > 50)data = data.slice(0, 50);
			
			async.each(data, function(item, callback){
				db.get(conf.riakBuckets.usersLog, item, function(err, result){		
					if(result.action == "search"){
						result.time = item;	
						callback(result);
						return;
					}									
					callback();
				});
			},
			function(result){
				cb(null, result)
			});			
			
		})
	}
}

module.exports.log = log;
module.exports.get = get;

module.exports.create = function(newUser, cb){
	get(newUser.login,  function(err, rslt){
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




