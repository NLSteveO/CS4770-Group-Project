/*
 * Mongoose schema to create a User model 
 * for adding users to the database.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
	Name: String,
	Username: String,
	Password: String, 
	Email: String,
	Token: String,
	Network: String,
	Type: String,
	Sim: String
});

module.exports = mongoose.model('User', UserSchema);
