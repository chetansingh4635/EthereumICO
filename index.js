const express=require('express');
const parser=require('body-parser');
var Promise = require('bluebird');
const morgan=require('morgan');
var http = require('http');
var config= require('./config/config.json');
var cors= require('cors');
var mongoose = require('mongoose');
const app=express();

//importing the required module
var router=require('./router');

//parsing the body
app.use(parser.json());
app.use(cors());



// Creating Middlewares
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(router);
var server = http.createServer(app);
var connectAsync = Promise.promisify(mongoose.connect, { context: mongoose });
var listenAsync = Promise.promisify(server.listen, { context: server });
connectAsync(config.mongoUrl)
    .then(function () {
        return listenAsync(config.serverPort);
    }).then(function () {
        return console.info("Server online at port ",config.serverPort)
    }).catch(function (err) {
        throw err;
    });
// Starting the server
// app.listen(3000, function () {
//   console.log('Example app listening on port 3000!')
// })


