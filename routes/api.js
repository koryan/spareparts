var user = require('../models/user');
var xml = require('../models/xml');
var async = require('async');
var conf = require('../conf.json')


var articulsSearch = function(articuls, cb){
	xml.articulsSearch(articuls, function(err, result){
		if(err){cb(err);}
		cb(null, result);
	})
}


exports.getSummaryS = function (req, res, next) {
	async.parallel([
	    function(callback){
	    	user.count(callback)
	    },
	    function(callback){

	    	xml.getLastTry(callback)
	    },
	],
	function(err, data, asd){

		console.log(err)
		if(err){return next(err);}
		if(!data[1])data[1] = {};
		console.log("444")
		res.json({
		    usersNum: data[0],
		    lastQuery: {
		    	date: '12.02.2015', 
		    	user: 'Darth Vader',
		    	ip: '192.0.0.1'
		    },
		    addresses: [
		    	conf.mailAddresess
		    ],
		    xmlStatus:{
		    	success: data[1].valid,
		    	datetime: data[1].time
		    }
		  })
	})		
  



  
};

exports.userCreate = function(req, res, next){
	console.log("we alive!")
    user.create(req.body.newUser, function(err, data){
    	console.log("after creating")

        if(err){
            return next(err);}
        if(data == "exists"){
            console.log("exists")
            res.send({exists:true})
            return;
        }
        console.log("data", data)
        res.send(true)
    })
}

exports.userRemove = function(req, res, next){	
    user.del(req.body.login, function(err, data){
        if(err){return next(err);}       
        res.send(true)
    })
}

exports.userEdit = function(req, res, next){
	user.save(req.body.user, function(err, data){    	
        if(err){
            return next(err);}
        res.send(true)
    })
}

exports.getUsersListS = function (req, res, next) {
    user.getList(function(err, data){
		if(err)return next(err);
		res.json(data);
    })  
};



exports.login = function (req, res) {	
	user.auth(req.body.login, req.body.password, req.connection.remoteAddress, function(err, user){		
		if(err){
			if(!!~["notFound","blocked", "wrongIp", "wrongPass"].indexOf(err)){
				res.send(err);				
			}else return next(err);	
		}
		if(user){
			req.session.user = user;
			res.send(true)
		}else{res.send(false);}
		
	})
};

exports.processXML = function(req, res, next){
	xml.process(function(err){
		if(err){return next(err);}
		res.redirect('back');
	})	
}

exports.processArticuls = function(req, res, next){
	var fs = require('fs');
	fs.readFile(conf.uploadFolder+"/"+conf.articulsFileName, function (err, data) {	
		if (err){return next(err);}
		console.log(data.toString().split("\n"))
		articulsSearch(data.toString().split("\n"), function(err, result){
			if(err){return next(err);}
			res.send(result);
		})
	})
}

exports.getXmlLastTry = function(req, res, next){
	xml.getLastTry(function(err, data){
		if(err){return next(err);}
		res.send(data);
	})	
}


exports.articulsSearch = function(req, res, next){
	articulsSearch(req.body.articuls, function(err, result){
		if(err){return next(err);}
		res.send(result);
	})
}

exports.sendMail = function(req, res, next){
	res.send({"status":"notReady"});
}
