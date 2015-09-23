/*
 * Mongoose schema to create a Network model 
 * for adding networks to the database.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var NetworkSchema = new Schema({
	Name: String,
	Type: String,
	Sim: String,
	Clients: [{Token: {Type: String}}]
});

module.exports = mongoose.model('Network', NetworkSchema);
