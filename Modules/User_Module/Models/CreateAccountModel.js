var _ = require('lodash'),
    mongoose = require('mongoose'),
    Schema = require('mongoose').Schema;



// options
var options = {
};

// schema
var schema = new Schema({
     emailId: { type: String, trim: true, lowercase: true },
     address: { type: String, trim: true, lowercase: true },
     public:{ type: String, trim: true, lowercase: true },
     private:{ type: String, trim: true, lowercase: true }
    

    }, options);

//  plugins
// schema.plugin(plugins.mongooseFindPaginate);
// schema.plugin(plugins.mongooseSearch, ['firstName', 'lastName', 'emailId']);

// autopopulate plugin
// schema.plugin(autopopulate);

// // Schema hooks method
// schema.pre('save', function (next) {
//     this.fullName = _.isString(this.lastName) ? (this.firstName + ' ' + this.lastName) : this.firstName;
//     next();
// });

// model
module.exports = mongoose.model('CreateAccount', schema);
