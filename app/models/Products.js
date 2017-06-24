
// defining a mongoose schema 
// including the module
var mongoose = require('mongoose');
// declare schema object.
var Schema = mongoose.Schema;

var productSchema = new Schema({

	productID 			: {type:String},
	productName  		: {type:String,default:''},
	productCategory  	: {type:String,default:''},
	productCost	  	    : {type:String,default:''}
	
});

mongoose.model('Product',productSchema);