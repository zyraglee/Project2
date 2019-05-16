var http = require('http');
var url = require('url');
var qs = require('querystring');
var fs = require("fs");
var ROOT_DIR = "./View";


//Mongo Connectionc
const MONGO_URL = "mongodb://localhost/mean";
const MONGO_USERNAME = "matchMaker";
const MONGO_PASSWORD = "p@ssw0rd";

const mongoose = require('mongoose');
mongoose.connect(MONGO_URL, {
    auth: {
        user: MONGO_USERNAME,
        password: MONGO_PASSWORD
    },
    useNewUrlParser: true
});

//Get the DB schema
mongoose.set('useCreateIndex', true);
const meanSchema = require('./js/mean_schema.js').meanSchema;
const User = mongoose.model('User', meanSchema);

mongoose.connection.once('open', function () {
    console.log("Open connection!");
});

const bcrypt = require('bcrypt');

http.createServer(function(request, response) {

    if (request.method === "GET") {

        if(request.url === "/Home"){
            console.log("Home file found");
            sendFileContent(response, "./View/Home.html", "text/html");
        }
        else if(request.url === "/Profile"){
            console.log("Profile file found");
            sendFileContent(response, "./View/Profile.html", "text/html");
        }
        else if(request.url === "/Login"){
            sendFileContent(response, "./View/Login.html", "text/html");
        }
        else if(request.url === "/Register"){
            sendFileContent(response, "./View/Register.html", "text/html");
        }
        else if(request.url === "/Search"){
            console.log("Home file found");
        }
        else if(request.url === "/"){
            response.writeHead(200, {'Content-Type': 'text/html'});
            response.write('This is the default response. Requested URL is: ' + request.url);
        }
        else if(/^\/[a-zA-Z0-9\/]*.js$/.test(request.url.toString())){
            sendFileContent(response, request.url.toString().substring(1), "text/javascript");
        }
        else if(/^\/[a-zA-Z0-9\/]*.css$/.test(request.url.toString())){
            console.log("CSS file found")
            sendFileContent(response, request.url.toString().substring(1), "text/css");
            console.log(request.url.toString().substring(1))
        }
        else if(/^\/[a-zA-Z0-9\/]*.jpg$/.test(request.url.toString())){
            console.log("Picture URL requested" + request.url.toString().substring(1))
            sendFileContent(response, request.url.toString().substring(1), "image/jpg");
        }
        else if(/^\/[a-zA-Z0-9\/]*.jpeg$/.test(request.url.toString())){
            console.log("Picture URL requested" + request.url.toString().substring(1))
            sendFileContent(response, request.url.toString().substring(1), "image/jpg");
        }
    }


        //POST method call
    else if (request.method === "POST") {
        var body = '';

        request.on('data', function (data) {
            body += data;

            // Too much POST data, kill the connection!
            // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
            if (body.length > 1e6) {
                request.connection.destroy();
                mongoose.disconnect();
            }
        });
        if(request.url === "/Register"){
            console.log("POST method is called for new user register");
            request.on('end', function () {
                var post = qs.parse(body);
                console.log(post.username);
                console.log(post.password);

                bcrypt.hash(post.password, 10, function (err, hash) {
                    console.log(post.password + " is hashed to: " + hash);

                    var newUser = new User({
                        userName: post.username,
                        password: hash
                    });

                    newUser.save(function (err, doc) {
                        if (err) {
                            console.log(err);
                            response.writeHead(412);
                            response.end(JSON.stringify(err));
                        } else {
                            console.log("\nSaved document: " + doc);
                            response.writeHead(200);
                            response.end(JSON.stringify(doc));
                        }
                        // mongoose.disconnect();
                    });
                });
            });
        }
        else if(request.url === "/Login"){
            console.log("The POST method was called from the login page.");
            request.on('end', function () {
                var post = qs.parse(body);
                console.log(post.username);
                console.log(post.password);
                var username = post.username;
                User.findOne({userName: username}, function (err, result) {

                    console.log(result.password + result.userName);
                    var userPass = result.password;
                    //Test the hash from the DB with the password provided
                    bcrypt.compare(post.password, userPass, function (err,result) {
                        if(result === true){
                            console.log("Passwords matched");
                            response.writeHead(200);
                            response.end(JSON.stringify(result));
                        }
                        else{
                            console.log("Incorrect Password")
                        }
                    })
                });
            });
        }
        //profile
        else if (urlObj.pathname == "/Profile") {
            req.on('end', function () {
                var post = qs.parse(body);
                console.log(post.username);
                User.schema.path('firstName').validate(function (value) {
                    return value.length < 50;
                }, "First Name is more than 50 characters!");
                User.schema.path('lastName').validate(function (value) {
                    return value.length < 50;
                }, "Last Name is more than 50 characters!");
                User.schema.path('interests').validate(function (value) {
                    return value.length < 2000;
                }, "Interests is too long!");
                User.schema.path('state').validate(function (value) {
                    return value.length < 52;
                }, "State Name is too long!");
                User.updateOne({userName: post.username},
                    {
                        $set: {
                            firstName: post.firstName,
                            lastName: post.lastName,
                            interests: post.interests,
                            state: post.state
                        }
                    }, {upsert: false, w: 1},
                    function (err, doc) {
                        console.log("Saving document to database.");
                        if (err) {
                            console.log(err);
                            res.writeHead(412);
                            res.end(JSON.stringify(err));
                        } else {
                            console.log("\nSaved document: " + doc);
                            res.writeHead(200);
                            res.end(JSON.stringify(doc));
                        }
                        // mongoose.disconnect();
                    });
                res.writeHead(200);
            });
        }
    }
}).listen(8080);

function sendFileContent(response, fileName, contentType){
    fs.readFile(fileName, function(err, data){
        if(err){
            response.writeHead(404);
            response.write("Not Found!");
        }
        else{
            response.writeHead(200, {'Content-Type': contentType});
            response.write(data);
        }
        response.end();
    });
}
