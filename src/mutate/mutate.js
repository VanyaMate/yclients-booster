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

const setAttribute = function (attributeName, to) {
	return (element) => {
		element.setAttribute(attributeName, to);
	};
};

const insertElement = function (element, position) {
	return (parentElement) => {
		parentElement.insertAdjacentElement(position, element);
	};
};

const insertHTML = function (html, position) {
	return (parentElement) => {
		parentElement.insertAdjacentHTML(position, html);
	};
};

const insertText = function (text, position) {
	return (parentElement) => {
		parentElement.insertAdjacentText(position, text);
	};
};

const url = function () {
	const hasList = [];
	const orList = [];
	let isNot = false;

	const has = function (value) {
		hasList.push(value);
		return methods;
	};

	const or = function (value) {
		orList.push(value);
		return methods;
	};

	const not = function () {
		isNot = true;
		return methods;
	};

	const get = function () {
		const hasCondition = hasList.length
			? hasList.every((has) => !!location.href.includes(has))
			: true;
		const orCondition = orList.length
			? orList.some((or) => !!location.href.includes(or))
			: true;
		const condition = hasCondition && orCondition;

		return isNot ? !condition : condition;
	};

	const methods = { has, not, or, get };
	return methods;
};

const mutate = function (rootElement) {
	const saveRootElement = rootElement ?? document.body;
	const actions = [];

	const onMutate = function () {
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

mutate().action({
	when: [url().has("dev/ui")],
	in: [".error"],
	for: ["*"],
	actions: [replaceText("404", "505")],
});
