'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var h = _fs2.default.readFileSync(__dirname + '/public/lfLogin.html');
var m = new Map();
m.set('login', h);
//delete h;
var app = (0, _express2.default)();
app.use(_express2.default.static(__dirname + '/public'));

app.get('/', function (req, res) {
	res.write(m.get('login').toString());
	res.end();
});

app.listen('3000', function () {
	console.log("hi");
});
