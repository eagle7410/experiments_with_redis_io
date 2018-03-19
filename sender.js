let express     = require('express');
let clientRedis = require('./redis-client');
let port        = 5001;
let router      = express.Router({ strict: true });
let app         = express();
let http        = require('http').Server(app);

app.get('/send', (req, res) => {
	clientRedis.set('send', 'New Message ' +Date.now());
	res.send(`New send gone`);
});

router.get('/', (req, res) => res.send(`This is port ${port}!`));

http.listen(port, () => console.log(`Server run in port -> ${port}`));
