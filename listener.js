let express     = require('express');
let port        = 5002;
let app         = express();
let http        = require('http').Server(app);
let io          = require('socket.io')(http);
let clientRedis = require('./redis-client');

app.get('/', (req, res) => res.sendFile(`${__dirname}/index.html`, {port : port}));

io.on('connection', function (socket) {
	socket.emit('start', { text: `listen port ${port}` });

	clientRedis.get('send', (err, text) => {

		if (err) return console.error(err);
		// TODO: clear
		console.log('send', text);
		socket.emit('send', {text});
	});
});

http.listen(port, () => console.log(`Server run in port -> ${port}`));
