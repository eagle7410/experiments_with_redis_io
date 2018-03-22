let redis = require('redis');

class Channel {
	constructor (channel) {
		if (!channel) throw new Error('Empty channel name');
		this.channel = channel;

		this.subscriber = redis.createClient();
		this.subscriber.subscribe(this.channel);

		this.publisher = redis.createClient();
	}

	/**
	 * Listen event
	 * @param {function} handler
	 */
	listen(handler) {
		this.subscriber.on('message', handler);
	}

	/**
	 * Handler on error
	 * @param {function} handler
	 */
	error(handler) {
		this.subscriber.on('error', handler);
	}


	/**
	 * Publish message in channel
	 * @param {string} message
	 */
	publish (message) {
		this.publisher.publish(this.channel, message);
	}
}


class RedisPublisher {
	constructor () {
		this.channels = {};
	}

	/**
	 *
	 * @param {string} channel
	 */
	channelOpen(channel) {
		this.channels[channel] = new Channel(channel);
	}

	/**
	 * Set listenrs to channel
	 * @param {string}   channel
	 * @param {function} handler
	 */
	channelListen(channel, handler) {
		this._channel(channel).listen(handler);
	}

	/**
	 * Handler in channel on error
	 * @param {string}   channel
	 * @param {function} handler
	 */
	channelError(channel, handler) {
		this._channel(channel).error(handler);
	}

	/**
	 * Publish message in channel.
	 * @param {string} channel
	 * @param {string} message
	 */
	channelPublish (channel, message) {
		this._channel(channel).publish(message);
	}

	/**
	 * Get specified channel
	 * @param {string} channel
	 * @returns {*}
	 * @private
	 */
	_channel (channel) {
		if (!this.channels[channel])
			throw new Error(`Channel ${channel} don't open`);

		return this.channels[channel]
	}

}

module.exports = new RedisPublisher();
