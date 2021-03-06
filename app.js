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
	userLogger = require('./middleware/userLogger'),
	multer = require('multer'),	
	conf = require('./conf.json'),
	mailer = require('express-mailer'),
	session = require("express-session");


var app = module.exports = express();
var riakStore = require('connect-riak-sessions')(session);
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, conf.uploadFolder)
  },
  filename: function (req, file, cb) {
    cb(null, conf.xmlFileName)
  }
})
var upload = multer({ storage: storage })


/**
 * Configuration
 */

// all environments

app.set('port', conf.applicationPort);
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
    bucket: conf.riakBuckets.app_session_bucket,
    scheme: 'http',
    host: conf.riak.host,
    port: conf.riak.port,
  }),
  secret: 'keyboard cat'
}));

mailer.extend(app, {
  from: conf.mailer.from,
  host: 'smtp.gmail.com', 
  secureConnection: true, // use SSL 
  port: 465, // port for secure SMTP 
  transportMethod: 'SMTP', // default is SMTP. Accepts anything that nodemailer accepts 
  auth: {
    user: conf.mailer.user,
    pass: conf.mailer.password
  }
});

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
        if(req.session.user){
            if(req.session.user.isAdmin){
              res.redirect('/admin');
            }else res.redirect('/');            
        }else next()
    }, routes.login);
app.get('/logout', function(req, res){
	req.session.user = null;	
	res.redirect("/login");
}, routes.login);

// JSON API
app.post('/api/getUsersListS', auth.checkAdmin, api.getUsersListS);
app.post('/api/getSummaryS', auth.checkAdmin, api.getSummaryS);
app.post('/api/login', api.login);
app.post('/api/userCreate', auth.checkAdmin, api.userCreate);
app.post('/api/userRemove', auth.checkAdmin, api.userRemove);
app.post('/api/userEdit', auth.checkAdmin, api.userEdit);
app.post('/api/loadXML', [auth.checkAdmin, upload.single('xml')], api.processXML);
app.post('/api/getLogs/all', auth.checkAdmin, api.log.readAll);
app.post('/api/getLogs/personal', auth.checkAdmin, api.log.read);
app.post('/api/getXmlLastTry', api.getXmlLastTry);

app.get('/processXML', api.processXML);
app.get('/plungeXML', upload.single('xml'), api.processXML);



app.post('/api/loadArticuls', [auth.checkUser, upload.single('articuls')], api.processArticuls);
app.post('/api/articulsSearch', [userLogger.search, auth.checkUser], api.articulsSearch);
app.post('/api/sendMail', [auth.checkUser, userLogger.send], function (req, res, next) {
  res.mailer.send('email', {
    to: conf.mailer.addresses.join(','), // REQUIRED. This can be a comma delimited string just like a normal email to field.  
    subject: conf.mailer.subject, // REQUIRED. 
    otherProperty: {query:req.body.query, serial:req.body.serial, userLogin: req.session.user.login}, // All additional properties are also passed to the template as local variables. 
    query:req.body.query,
    serial:req.body.serial,
    userLogin: req.session.user.login
  }, function (err) {
    if (err) {
      // handle error 
      console.log("Error!", err);
      res.send('There was an error sending the email');
      return;
    }
    res.send("ok");
  })
});



// redirect all others to the index (HTML5 history)
app.get('*', routes.p404);

/**
 * Start Server
 */

http.createServer(app).listen(app.get('port'), function () {
  console.log('Server listening on port ' + app.get('port'));
});
