let express     = require('express');
let port        = 5002;
let app         = express();
let http        = require('http').Server(app);
let io          = require('socket.io')(http);
let redisPub    = require('./redis-publisher');

app.get('/', (req, res) => res.sendFile(`${__dirname}/index.html`, {port : port}));

io.on('connection', function (socket) {
	socket.emit('start', { text: `listen port ${port}` });

	['scaner', 'scaner2'].map(channel => {
		redisPub.channelOpen(channel);
		redisPub.channelListen(channel, function (channel, message) {
			// Receive message Hello world! from channel news
			// Receive message Hello again! from channel music
			console.log('Receive message %s from channel %s', message, channel);
		})
	});

});

http.listen(port, () => console.log(`Server run in port -> ${port}`));
