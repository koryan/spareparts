var user = require('../models/user');

exports.name = function (req, res) {
  res.json({
    name: 'Bob'
  });
};

exports.getSummaryS = function (req, res) {
  res.json({
    usersNum: 100500,
    lastQuery: {
    	date: '12.02.2015', 
    	user: 'Darth Vader',
    	ip: '192.0.0.1'
    },
    addresses: [
    	"http://yandex.ru",
    	"http://google.com"
    ],
    xmlStatus:{
    	success: true,
    	datetime: "15.04.2005 12:34"
    }
  });
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

exports.getUsersListS = function (req, res, next) {
    user.getList(function(err, data){
		if(err)return next(err);
		res.json(data)
    })  
};

exports.login = function (req, res) {	
	user.auth(req.body.login, req.body.password, req.connection.remoteAddress, function(err, user){
		
		if(err)return next(err);
		if(user){
			req.session.user = user;

			res.send(true)
		}else{res.send(false)}
		
	})
};