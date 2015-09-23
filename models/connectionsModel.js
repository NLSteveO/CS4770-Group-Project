/*
 * Mongoose schema to create a Connection model 
 * for connecting networks together in the database.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ConnectionSchema = new Schema({
	Network1: String,
	Network2: String,
	Sim: String
});

module.exports = mongoose.model('Connection', ConnectionSchema);
