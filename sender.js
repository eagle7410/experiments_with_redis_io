let express     = require('express');
let port        = 5001;
let router      = express.Router({ strict: true });
let app         = express();
let http        = require('http').Server(app);
let redisPub    = require('./redis-publisher');

app.get('/send', (req, res) => {
	['scaner', 'scaner2'].map(channel => {
		redisPub.channelOpen(channel);
		redisPub.channelPublish(channel, 'Hello world!');
		redisPub.channelPublish(channel, 'Hello again!');
	});

	res.send(`New send gone`);
});

router.get('/', (req, res) => res.send(`This is port ${port}!`));

http.listen(port, () => console.log(`Server run in port -> ${port}`));
