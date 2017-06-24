var mongoose = require('mongoose');
var express = require('express');

// express router // used to define routes 
var userRouter = express.Router();
var cartModel = mongoose.model('cart')
var productModel = mongoose.model('Product')
var responseGenerator = require('./../../libs/responseGenerator');
var auth = require("./../../middlewares/auth");

module.exports.controllerFunction = function (app) {

//route to add the products to cart
    userRouter.get('/addtocart/:productName', auth.checkLogin, function (req, res) {
    	productModel.findOne({'productName': req.params.productName} , function(err, result){
    		if(!err)
    		{
       if (req.params.productName != undefined && req.params.productName != null) {
            var newCart = new cartModel({
            	userName			: req.session.user.userName,
	            userEmail           : req.session.user.email,
	            productName  		: result.productName,
	            productCategory  	: result.productCategory,
	            productCost	  	    : result.productCost
            });

            newCart.save(function (err) {
                if (err) {
                    console.log("Some error");
                    var myResponse = responseGenerator.generate(true, "Sorry! product can't be added to store right now..." + err, 500, null);
                    //res.send(myResponse);
                    res.render('error', {
                        message: myResponse.message,
                        error: myResponse.data
                    });

                } else {
                   // req.session.cart = newCart;
                    console.log(req.session);
                    res.redirect('/users/products');
                }
            });
        }
    }
    else
    {
    	 console.log("Some error");
                    var myResponse = responseGenerator.generate(true, "Sorry! product can't be added to store right now..." + err, 500, null);
                    //res.send(myResponse);
                    res.render('error', {
                        message: myResponse.message,
                        error: myResponse.data
                    });
    }
    });
    });

 //routes to view the products in the cart...
    userRouter.get('/Ecommercecart', auth.checkLogin, function (req, res) {
        cartModel.find({'userName': req.session.user.userName},function(err, result){
        		if (err) {
                    console.log("Some error");
                    var myResponse = responseGenerator.generate(true, "Sorry! product can't be added to store right now..." + err, 500, null);
                    //res.send(myResponse);
                    res.render('error', {
                        message: myResponse.message,
                        error: myResponse.data
                    });

                } else {
                	console.log(result);
                    res.render('Ecommercecart',{
                    	cartItems:result,
                    	user: req.session.user
                    });
                }
    });
    });

//Route to delete the Items from the Cart...
    userRouter.get('/Ecommercecartdelete/:productName', auth.checkLogin, function (req, res) {
        cartModel.findOneAndRemove({ $and: [ {'productName': req.params.productName},{'userName':req.session.user.userName} ] } , function(err, result){
    		if (err) {
                var myResponse = responseGenerator.generate(true, "some error" + err, 500, null);
                res.send(myResponse);
            } else if (result == null || result == undefined || result == undefined || result == '') {

                var myResponse = responseGenerator.generate(true, "product not found", 404, null);
                //res.send(myResponse);
                res.render('error', {
                    message: myResponse.message,
                    error: myResponse.data
                });

            } else {

            		console.log("product deleted...");
                res.redirect('/users/Ecommercecart');
            }

        });          

    });


//Application level middlewares for generic Errors
    app.use(function (err, req, res, next) {
    	console.log(err.status);
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
