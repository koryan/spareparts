
/**
 * Module dependencies
 */

var express = require('express'),
	bodyParser = require('body-parser'),
	methodOverride = require('method-override'),
	errorHandler = require('errorhandler'),
	morgan = require('morgan'),
	routes = require('./routes'),
	api = require('./routes/api'),
	http = require('http'),
	//middleware = require('./middleware')(app, express),
	path = require('path'),
	auth = require('./middleware/auth'),
	session = require("express-session");

var app = module.exports = express();
var riakStore = require('connect-riak-sessions')(session);


/**
 * Configuration
 */

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(methodOverride());
app.use(express.static(path.join(__dirname, 'public')));


app.use(session({
  store: new riakStore({
    bucket: 'app_session_bucket',
    scheme: 'http',
    host: 'localhost',
    port: 8098,
  }),
  secret: 'keyboard cat'
}));

// app.use(function(req, res, next){
// 	req.riakClient = new Riak.Client(['localhost:8098']);
// 	next()
// })



var env = process.env.NODE_ENV || 'development';

// development only
if (env === 'development') {
  app.use(errorHandler());
}

// production only
if (env === 'production') {
  // TODO
}

/**
 * Routes
 */

// serve index and view partials
app.get('/', function(req, res, next){ 
		if(!req.session.user){
			res.redirect("/login")
		}else if(req.session.user && req.session.user.isAdmin){			
			res.redirect("/admin")
		}else next()
	}, routes.index);
app.get('/admin', auth.checkAdmin, routes.admin);
app.get('/admin/logs', auth.checkAdmin, routes.admin);
app.get('/admin/userslist', auth.checkAdmin, routes.admin);
app.get('/admin/xml', auth.checkAdmin, routes.admin);
app.get('/login', function(req, res, next){ 
		console.log("res.user", res.user)
        if(req.session.user){
            if(req.session.user.isAdmin){
              res.redirect('/admin');
            }else res.redirect('/');            
        }else next()
    }, routes.login);
app.get('/logout', function(req, res){
	req.session.user = null;	
	res.redirect("/login");
}, routes.login)

app.get('/partials/:name', routes.partials);

// JSON API
app.post('/api/getUsersListS', auth.checkAdmin, api.getUsersListS)
app.post('/api/getSummaryS', auth.checkAdmin, api.getSummaryS)
app.post('/api/login', api.login)
app.post('/api/userCreate', auth.checkAdmin, api.userCreate)
app.post('/api/userRemove', auth.checkAdmin, api.userRemove)


// redirect all others to the index (HTML5 history)
app.get('*', routes.p404);

console.log("....................the end")
/**
 * Start Server
 */

http.createServer(app).listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});
