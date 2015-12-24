var i = 0;

require("http").createServer(function (req, res) {
	res.write("hello world from server\n");
	res.end();
	console.log('LOG: ' + i++ + ' request received');
	//console.log(req);

}).listen(1337);