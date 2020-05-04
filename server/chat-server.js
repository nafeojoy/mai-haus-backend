require("babel-register");
require("babel-polyfill");
require('dotenv').config()


// Load server configuration
var chatApp = require('./chat/chat-server.conf.js');
