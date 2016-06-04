var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var Account = new Schema({
    username: String
});

module.exports = mongoose.model('Account', Account);