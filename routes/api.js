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

exports.getUsersListS = function (req, res) {
  res.json(
    [{name: 'Darth Vader',
    org: 'Imperial Fleet',
    fio: 'Anakin Skywalker',
    ip:'127.0.0.1'},
    {name: 'Lara',
    org: 'Tomb Rader',
    fio: 'Lara Croft',
    ip:'192.168.0.1'},
    {name: 'User',
    org: 'Organisation',
    fio: 'Users\'s fio',
    ip:'10.0.0.10'},{name: 'Darth Vader',
    org: 'Imperial Fleet',
    fio: 'Anakin Skywalker',
    ip:'127.0.0.1'},
    {name: 'Lara',
    org: 'Tomb Rader',
    fio: 'Lara Croft',
    ip:'192.168.0.1'},
    {name: 'User',
    org: 'Organisation',
    fio: 'Users\'s fio',
    ip:'10.0.0.10'}]
    );
};

exports.login = function (req, res) {
	req.session.qazqaz = "qazqaz"
	user.auth(req, res, function(err, user){
		
		if(err)return next(err);
		if(user){
			req.session.user = user;

			res.send(true)
		}else{res.send(false)}
		
	})
};