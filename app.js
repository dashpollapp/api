import express from 'express';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import authPropToReq from './middlewares/authPropToReq';
import applyRoutes from './routes';

const app = express();

//Middlewares
//app.use(expressSession());
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

//app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser());
//app.use(passport.initialize());
//app.use(passport.session());
app.use(logger('dev'));
app.use(function(req, res, next) {
    var oneof = false;
    if(req.headers.origin) {
        res.header('Access-Control-Allow-Origin', req.headers.origin);
        oneof = true;
    }

    res.setHeader("Access-Control-Allow-Credentials", true);

    if(req.headers['access-control-request-method']) {
        res.header('Access-Control-Allow-Methods', req.headers['access-control-request-method']);
        oneof = true;
    }
    if(req.headers['access-control-request-headers']) {
        res.header('Access-Control-Allow-Headers', req.headers['access-control-request-headers']);
        oneof = true;
    }
    if(oneof) {
        res.header('Access-Control-Max-Age', 60 * 60 * 24 * 365);
    }

    // intercept OPTIONS method
    if (oneof && req.method == 'OPTIONS') {
        res.send(200);
    }
    else {
        next();
    }
});
app.use(authPropToReq());




//Routes from /routes/index.js
applyRoutes(app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {

    if(err.status !== 404) console.error(err);
    // set locals, only providing error in development
    res.locals.message = err.message || 'no error message defined';
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    //console.log(err);

    // render the error page
    res.status(err.status || 500);
    res.json({status: 'error', error: err, msg: err.message || 'no error message defined'});
});


export default app;
