var moment = require("moment")
var	db = require('riak-js')();
var conf = require('../conf.json');
var xml2json = require('xml2json');
var	db = require('riak-js')();
var fs = require('fs');
var async = require('async')

//db.save('users', newUser.login, newUser, function(err, rslt) {

var writeProcessResult = function(result, cb){
	var time = new Date().getTime();
	console.log("writing xml process results")
	db.save(conf.riakBuckets.xml, 'lastTry', {time:time})

	if(result){
		async.parallel([
		    function(callback){
		    	db.save(conf.riakBuckets.xml, time, JSON.stringify(result), callback)
		    },
		    function(callback){
		    	db.save(conf.riakBuckets.xml, 'lastGoodTry', {time:time}, callback)
		    },
		],
		function(err){
			if(err){cb(err);return;}
			cb();
		})		
	}else{
		cb()
	}	
}

module.exports.process = function (cb) {
	console.log("alive")	
	fs.readFile(conf.xmlFolder+"/"+conf.xmlFileName, function (err, data) {		
		var json = {}
		if (err){cb(err);return;}
		try {
	        json = xml2json.toJson(data);
			writeProcessResult(json, cb)
			return;	        
	    } catch (e) {
	    	console.log("ERROR", e)
	        writeProcessResult(false, cb)
	        return;	 
	    }			
	});
}

module.exports.getLastTry = function(cb){
	console.log("rwaterfall start");
	var time = undefined;

   	db.get(conf.riakBuckets.xml, 'lastTry', function(err, data){
   		if(err){cb(err);return;}
	    time = moment(data.time).format("DD.MM.YYYY HH:mm:ss")
	    db.get(conf.riakBuckets.xml, data.time, function(err, data){
	    	if(err){	
	    		if(err.notFound){
		    		cb(null, {time:time, valid:false})
		    		return;
		    	}	
	    	}
	    	cb(null, {time:time, valid:true})
	    })	    
   	})
	
	  
	
}

module.exports.get = function(cb){

	async.waterfall([
	    function(callback) {
	    	db.get(conf.riakBuckets.xml, 'lastGoodTry', callback)
	    },
	    function(key, callback) {
	        db.get(conf.riakBuckets.xml, key.time, callback)
	    },
	], function (err, result) {
		
	    if(err){
	    	console.log("Err on getting xml", err);
	    	cb(err);
	    	return;
	    }
	    cb(null, {time:key, data: JSON.parse(result)})
	});	
}