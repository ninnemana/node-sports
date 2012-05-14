
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'your secret here' }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

app.get('/', routes.index);
app.get('/category/:id?',routes.category);
app.get('/category/:id?/parts/:page?/:count?', routes.category_parts);
app.get('/lookup/:mount?/:year?/:make?/:model?/:style?', routes.lookup);

// Static Lookup
app.get('/mount', routes.select_mount);
app.get('/year/:mount?', routes.select_year);
app.get('/make/:mount?/:year?', routes.select_make);
app.get('/model/:mount?/:year?/:make?', routes.select_model);
app.get('/style/:mount?/:year?/:make?/:model?', routes.select_style);


app.listen(process.env.PORT || 3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
