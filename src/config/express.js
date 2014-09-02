var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var busboy = require('connect-busboy');

module.exports = function(server, router) {
    // view engine setup
    server.set('views', path.join(__dirname, '/../views'));
    server.set('view engine', 'jade');

    server.use(favicon());
    server.use(logger('dev'));
    server.use(busboy()); 
    server.use(bodyParser.json());
    server.use(bodyParser.urlencoded());
    server.use(cookieParser());
    server.use(session({secret: 'keyboard cat'}));
    server.use(express.static(path.join(__dirname, '/../../public')));


    server.use('/', router);

    /// catch 404 and forward to error handler
    server.use(function(req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

    // development error handler
    // will print stacktrace
    if (server.get('env') === 'development') {
        server.use(function(err, req, res, next) {
            res.status(err.status || 500);
            if(err.status === 404) {
                res.render('404');
            } else {
                res.render('error', {
                    message: err.message,
                    error: {}
                });
            }
        });
    }

    // production error handler
    // no stacktraces leaked to user
    server.use(function(err, req, res, next) {
        res.status(err.status || 500);
        if(err.status === 404) {
            res.render('404');
        } else {
            res.render('error', {
                message: err.message,
                error: {}
            });
        }
    });
};
