var mongoose = require('mongoose');
var _ = require('underscore');

var DomoModel;

var setName = function(name) {
	return _.escape(name).trim();
};

var setNationality = function(nationality) {
    return _.escape(nationality).trim();
};

var DomoSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		trim: true,
		set: setName
	},
	
	age: {
		type: Number,
		min: 0,
		required: true
	},
	
    nationality: {
        type: String,
        required: true,
        trim: true,
        set: setNationality
    },
    
	owner: {
		type: mongoose.Schema.ObjectId,
		required: true,
		ref: 'Account'
	},
	
	createdDate: {
		type: Date,
		default: Date.now
	}
});

DomoSchema.methods.toAPI = function() {
	return {
		name: this.name,
		age: this.age,
        nationality: this.nationality
	};
};

DomoSchema.statics.findByOwner = function(ownerId, callback) {
	var search = {
		owner: mongoose.Types.ObjectId(ownerId)
	};
	
	return DomoModel.find(search).select("name age nationality").exec(callback);
};

DomoModel = mongoose.model('Domo', DomoSchema);

module.exports.DomoModel = DomoModel;
module.exports.DomoSchema = DomoSchema;

