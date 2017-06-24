var mongoose = require('mongoose');
var express = require('express');

// express router // used to define routes 
var userRouter = express.Router();
var userModel = mongoose.model('User')
var responseGenerator = require('./../../libs/responseGenerator');
var auth = require("./../../middlewares/auth");

module.exports.controllerFunction = function (app) {

    userRouter.get('/', function (req, res) {
        res.render('index');
    });

    userRouter.get('/login/screen', function (req, res) {
        res.render('login');
    });
    //end get login screen

    userRouter.get('/signup/screen', function (req, res) {

        res.render('signup');

    }); //end get signup screen

    userRouter.get('/lostpassword/screen', function (req, res) {

        res.render('lostpassword');

    }); //end get signup screen

    userRouter.get('/dashboard', auth.checkLogin, function (req, res) {

        res.render('dashboard', {
            user: req.session.user
        });


    }); //end get dashboard

    
    userRouter.get('/logout', function (req, res) {

        req.session.destroy(function (err) {

            res.redirect('/users/login/screen');

        })

    }); //end logout

    
    userRouter.post('/signup', function (req, res) {

        if (req.body.firstName != undefined && req.body.lastName != undefined && req.body.email != undefined && req.body.password != undefined) {

            var newUser = new userModel({
                userName: req.body.firstName + '' + req.body.lastName + Math.floor(Math.random() * 100 + 1),
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                mobileNumber: req.body.mobileNumber,
                password: req.body.password


            }); // end new user 

            console.log(req.body.firstName + '' + req.body.lastName + Math.floor(Math.random() * 100 + 1));


            newUser.save(function (err) {
                if (err) {
                    console.log("Some error");
                    var myResponse = responseGenerator.generate(true, "some error " + err, 500, null);
                    //res.send(myResponse);
                    res.render('error', {
                        message: myResponse.message,
                        error: myResponse.data
                    });

                } else {

                    //storing the  current user information in req.session, which is an app level middleware
                    //hence available in the whole app
                    //sessions are executed through cookies
                    //later this middleware(session) will be used everywhere to check the user information
                    req.session.user = newUser;
                    console.log(req.session);
                    //delete the password from the session information
                    //Basic security practice
                    //Hacker may have the temporary access but cannot have the permanent access
                    delete req.session.user.password;
                    res.redirect('/users/dashboard');
                    //res.redirect('/')
                }

            }); //end new user save


        } else {

            var myResponse = {
                error: true,
                message: "Some body parameter is missing",
                status: 403,
                data: null
            };

            //res.send(myResponse);

            res.render('error', {
                message: myResponse.message,
                error: myResponse.data
            });

        }


    }); //end get all users



    userRouter.post('/login', function (req, res) {

        userModel.findOne({
            $and: [{
                'email': req.body.email
            }, {
                'password': req.body.password
            }]
        }, function (err, foundUser) {
            if (err) {
                var myResponse = responseGenerator.generate(true, "some error" + err, 500, null);
                res.send(myResponse);
            } else if (foundUser == null || foundUser == undefined || foundUser.userName == undefined) {

                var myResponse = responseGenerator.generate(true, "user not found. Check your email and password", 404, null);
                //res.send(myResponse);
                res.render('error', {
                    message: myResponse.message,
                    error: myResponse.data
                });

            } else {


                console.log(req.session);
                req.session.user = foundUser;
                delete req.session.user.password;
                res.redirect('/users/dashboard')

            }

        }); // end find

    }); //end get signup screen

    //lost password module...
    userRouter.post('/lostpassword', function (req, res) {

        userModel.findOne({
            'email': req.body.email
        }, function (err, foundUser) {
            if (err) {
                var myResponse = responseGenerator.generate(true, "some error" + err, 500, null);
                res.send(myResponse);
            } else if (foundUser == null || foundUser == undefined || foundUser.userName == undefined) {

                var myResponse = responseGenerator.generate(true, "user not found. Check your email and password", 404, null);
                //res.send(myResponse);
                res.render('error', {
                    message: myResponse.message,
                    error: myResponse.data
                });

            } else {


                console.log(req.session);
                req.session.user = foundUser;
                res.render('lostpassword', {
                    password: req.session.user.password
                });


            }

        }); // end find

    });

    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        if (err.status == 404) {
            res.render('404', {
                message: err.message,
                error: err
            });
        } else {
            res.render('error', {
                message: err.message,
                error: err
            });
        }
    });


    // this should be the last line
    // now making it global to app using a middleware
    // think of this as naming your api 
    app.use('/users', userRouter);




} //end contoller code
