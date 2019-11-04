var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var businessSchema = new mongoose.Schema({
    business_name: String,
    business_email: String,
    business_number: String,
    business_website: String,
    business_type: String,
    business_location: String,
    business_descr: String,
    business_image: String,
    business_logo: String,
    business_gallery1:String,
    business_gallery2:String,
    business_gallery3:String,
    business_gallery4:String,
    business_location: String
});


module.exports = mongoose.model("Business", businessSchema);