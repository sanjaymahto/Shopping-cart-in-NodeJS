var mongoose = require('mongoose');
var express = require('express');

// express router // used to define routes 
var userRouter = express.Router();
var productModel = mongoose.model('Product')
var responseGenerator = require('./../../libs/responseGenerator');
var auth = require("./../../middlewares/auth");

module.exports.controllerFunction = function (app) {

    //route to get information of all the products...
    userRouter.get('/products', auth.checkLogin, function (req, res) {
    	productModel.find(function(err,result)
    	{
    		if(err)
    		{

    				var myResponse = responseGenerator.generate(true, "products not found", 404, null);
                //res.send(myResponse);
                res.render('error', {
                    message: myResponse.message,
                    error: myResponse.data
                });
    		}
    		else
    		{
    			console.log(result);
    			res.render('Ecommerceindex', {
            user: req.session.user,
            products: result
        });
    		}
    	});
        
    });

    //route to add the products...
    userRouter.get('/products/add', auth.checkLogin, function (req, res) {
        res.render('Ecommerceproductadd');
    });

    //route to edit the products...
    userRouter.get('/products/edit', auth.checkLogin, function (req, res) {
        res.render('Ecommerceproductedit');
    });

    //route to delete...
     userRouter.get('/products/delete', auth.checkLogin, function (req, res) {
        res.render('Ecommerceproductdelete');
    });

    //route to delete the products...
    userRouter.post('/delete', auth.checkLogin, function (req, res) {
        productModel.findOneAndRemove({
            'productName': req.body.productName
        }, function (err, foundProduct) {
            if (err) {
                var myResponse = responseGenerator.generate(true, "some error" + err, 500, null);
                res.send(myResponse);
            } else if (foundProduct == null || foundProduct == undefined || foundProduct.productName == undefined || foundProduct == '') {

                var myResponse = responseGenerator.generate(true, "product not found", 404, null);
                //res.send(myResponse);
                res.render('error', {
                    message: myResponse.message,
                    error: myResponse.data
                });

            } else {

            		console.log("product deleted...");
                res.redirect('/users/products');
            }

        });
    });

    //rout to post edit the products...
    userRouter.post('/productedit', auth.checkLogin, function (req, res) {
       productModel.findOne({'productName': req.body.productName} , function(err, result){
            if (err) {
                console.log("Some error");
                var myResponse = responseGenerator.generate(true, "Sorry! Product Not Found... " + err, 500, null);
                //res.send(myResponse);
                res.render('error', {
                    message: myResponse.message,
                    error: myResponse.data
                });
            } else {
            	if(result == null)
            	{
            		console.log("Some error");
                var myResponse = responseGenerator.generate(true, "Sorry! Product Not Found... " + err, 500, null);
                //res.send(myResponse);
                res.render('error', {
                    message: myResponse.message,
                    error: myResponse.data
                });
            	}
            	else
            	{
                req.session.product = result;
                console.log(req.session);
                res.render('Ecommerceproductedit2');
            }
            }
        });

    });


     userRouter.post('/productedit1', auth.checkLogin, function (req, res) {
     		//console.log(req.session.product.productName);
       productModel.findOne({'productName': req.session.product.productName} , function(err, result){
       			
            if (err) {
                console.log("Some error");
                var myResponse = responseGenerator.generate(true, "Sorry! Product Not Found... " + err, 500, null);
                //res.send(myResponse);
                res.render('error', {
                    message: myResponse.message,
                    error: myResponse.data
                });
            } else {
                
                
            console.log(result);
            result.productName       = req.body.productName;
            result.productCategory   = req.body.productCategory;
            result.productCost       = req.body.productCost;
            result.save(function(err){
              if(err){
                console.log("Some error");
                var myResponse = responseGenerator.generate(true, "Sorry! Product Not Found... " + err, 500, null);
                //res.send(myResponse);
                res.render('error', {
                    message: myResponse.message,
                    error: myResponse.data
                });
              }
              else{
                	req.session.product = result;
                console.log("product updated");
               console.log(res.session);
                res.redirect('/users/products');
              }
            });
            
          }


        });

    });

    //route to add the products using post...
    userRouter.post('/productadd', auth.checkLogin, function (req, res) {
        if (req.body.productName != undefined && req.body.productCategory != undefined && req.body.productCost != undefined) {
            var newProduct = new productModel({

                productID: Math.floor(Math.random() * 100 + 1),
                productName: req.body.productName,
                productCategory: req.body.productCategory,
                productCost: req.body.productCost
            });
            console.log(req.body.productName + '' + req.body.productCategory + '' + req.body.productCost);

            newProduct.save(function (err) {
                if (err) {
                    console.log("Some error");
                    var myResponse = responseGenerator.generate(true, "some error " + err, 500, null);
                    //res.send(myResponse);
                    res.render('error', {
                        message: myResponse.message,
                        error: myResponse.data
                    });

                } else {
                    req.session.product = newProduct;
                    console.log(req.session);
                    res.redirect('/users/products');
                }
            });
        }
    });



    userRouter.get('/dashboard', auth.checkLogin, function (req, res) {

        res.render('dashboard', {
            user: req.session.user
        });


    }); //end get dashboard

    //rout to log out...
    userRouter.get('/logout', function (req, res) {

        req.session.destroy(function (err) {

            res.redirect('/users');

        })

    }); //end logout

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
