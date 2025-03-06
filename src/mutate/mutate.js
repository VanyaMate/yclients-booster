class Observer {
	constructor(config, callback) {
		this.config = config;
		this.observer = new MutationObserver(callback);
	}

	observe(element) {
		this.observer.observe(element, this.config);
	}

	disconnect() {
		this.observer.disconnect();
	}
}

const hide = function () {
	return (element) => {
		element.remove();
	};
};

const replaceText = function (from, to) {
	return (element) => {
		element.childNodes.forEach((childNode) => {
			if (childNode.nodeName === "#text") {
				childNode.textContent = childNode.textContent.replaceAll(from, to);
			}
		});
	};
};

const url = function () {
	const hasList = [];
	let isNot = false;

	const has = function (value) {
		hasList.push(value);
		return methods;
	};

	const not = function () {
		isNot = true;
		return methods;
	};

	const get = function () {
		const condition = hasList.every((has) => !!location.href.match(has));

		return isNot ? !condition : condition;
	};

	const methods = { has, not, get };
	return methods;
};

const mutate = function (rootElement) {
	const saveRootElement = rootElement ?? document.body;
	const actions = [];

	const onMutate = function () {
		console.log("OnMutate");
		actions.forEach((config) => {
			if (config.when.every((condition) => condition.get())) {
				const inElements = config.in
					? saveRootElement.querySelectorAll(config.in.join(","))
					: [saveRootElement];
				inElements.forEach((element) => {
					const forElements = element.querySelectorAll(
						config.for?.join(",") ?? "*",
					);
					forElements.forEach((element) => {
						observer.disconnect();
						config.actions.forEach((action) => action(element));
						observer.observe(saveRootElement);
					});
				});
			}
		});
	};

	const action = function (config) {
		actions.push(config);
		return methods;
	};

	const mutationConfig = { childList: true, subtree: true };
	const observer = new Observer(mutationConfig, onMutate);
	observer.observe(saveRootElement);

	const methods = { action };
	return methods;
};

mutate()
	.action({
		when: [url().has("dev/ui")],
		in: ["#__nuxt"],
		for: ["*"],
		actions: [replaceText("404", "505")],
	})
	.action({
		when: [url().has("dev/ui").not()],
		in: [".content"],
		for: [".rainbow.title"],
		actions: [hide()],
	});
