
// defining a mongoose schema 
// including the module
var mongoose = require('mongoose');
// declare schema object.
var Schema = mongoose.Schema;

var cartSchema = new Schema({

	userName			: {type:String,require:true},
	userEmail           : {type:String,require:true},
	productName  		: {type:String,default:''},
	productCategory  	: {type:String,default:''},
	productCost	  	    : {type:String,default:''}
});

mongoose.model('cart',cartSchema);