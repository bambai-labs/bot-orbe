/**
 * @file messageQueue.js
 * @description An improved functional implementation of a multi-user message queueing system with debounce functionality,
 * ensuring separate conversation handling for each user.
 */

function createInitialState() {
	return {
		queues: new Map(),
	};
}

function resetTimer(userQueue) {
	if (userQueue.timer) {
		clearTimeout(userQueue.timer);
	}
	return { ...userQueue, timer: null };
}

function processQueue(messages) {
	const result = messages.map((message) => message.text).join(" ");
	return result;
}

function createMessageQueue(config) {
	let state = createInitialState();

	return function enqueueMessage(ctx, callback) {
		const from = ctx.from;
		const messageBody = ctx.body;

		if (!from || !messageBody) {
			console.error("Invalid message context:", ctx);
			return;
		}

		let userQueue = state.queues.get(from);
		if (!userQueue) {
			userQueue = { messages: [], timer: null, callback: null };
			state.queues.set(from, userQueue);
		}

		userQueue = resetTimer(userQueue);
		userQueue.messages.push({ text: messageBody, timestamp: Date.now() });
		userQueue.callback = callback;

		if (!userQueue.timer) {
			userQueue.timer = setTimeout(() => {
				const currentQueue = state.queues.get(from);
				if (currentQueue) {
					const result = processQueue(currentQueue.messages);
					if (currentQueue.callback) {
						currentQueue.callback(result, from);
					}
					state.queues.set(from, {
						...currentQueue,
						messages: [],
						timer: null,
					});
				}
			}, config.gapMilliseconds);
		}

		state.queues.set(from, userQueue);
	};
}

export { createMessageQueue };
