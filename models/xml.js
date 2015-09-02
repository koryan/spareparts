var moment = require("moment");
var conf = require('../conf.json');
var	db = require('riak-js')({host: conf.riak.host, port: conf.riak.port});
var xml2json = require('xml2json');
var fs = require('fs');
var async = require('async')

//db.save('users', newUser.login, newUser, function(err, rslt) {

var writeProcessResult = function(result, cb){
	var time = new Date().getTime();

	db.save(conf.riakBuckets.xml, 'lastTry', {time:time})

	if(result){
		async.parallel([
		    function(callback){
		    	db.save(conf.riakBuckets.xml, time, result, callback)
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
	fs.readFile(conf.uploadFolder+"/"+conf.xmlFileName, function (err, data) {		
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
   		if(err){
   			if(err.notFound){
	    		cb(null, null)
	    		return;
	    	}	
   			cb(err);
   			return;
   		}
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

var get = function(cb){
	db.get(conf.riakBuckets.xml, 'lastGoodTry', function(err, data){
   		if(err){
   			if(err.notFound){
	    		cb(null, null)
	    		return;
	    	}	
   			cb(err);
   			return;
   		}
	    time = moment(data.time).format("DD.MM.YYYY HH:mm:ss")
	    db.get(conf.riakBuckets.xml, data.time, function(err, data2){
	    	if(err){	
	    		if(err.notFound){
	    			console.log("not found lastGoodTry")
		    		cb(null, null)
		    		return;
		    	}	
	    	}
	    	cb(null, data2)
	    })	    
   	})
}

module.exports.get = get;

module.exports.articulsSearch = function(articuls, cb){
	
	get(function(err, result){
		if(err){
			console.log('ERROR IN GETTING BLOB', err)
			cb(err)
			return;
		}
		// Пример объекта 
		// { id_nom: 3120,
		//   name_nom: 'round steel bar EN10060-120x6000M-C45',
		//   price: 0,
		//   kol: 0 }
		//console.log(result)
		console.log("typeof result", typeof result)
		

		var json = JSON.parse(result);
		//var i =0;
		var result = [];
		//console.log(Object.keys(json.Data.str))
		for(j in json.Data.str){
			var elem = json.Data.str[j];			
			if(articuls.indexOf(elem.id_nom.toString()) !== -1){
				result.push(elem)
			}	
			//if(i > 10)		break;
			//i++;
		}
		//console.log()
		cb(null, result)
	})
}