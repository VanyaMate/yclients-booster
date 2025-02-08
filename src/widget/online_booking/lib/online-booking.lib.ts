export const url = function url () {
    let _values: Array<string> = [];
    let _not: boolean          = false;

    const _url = {
        has (value: string) {
            _values.push(value);
            return _url;
        },
        not () {
            _not = true;
            return _url;
        },
        get () {
            const matches = _values.some((value) => !!location.href.match(value));
            return _not ? !matches : matches;
        },
    };

    return _url;
};

export const mutation = function () {
    const replaceTextInElements = function (searchText: string, newText: string, element: Element) {
        element.childNodes.forEach((node) => {
            if (node.nodeType === Node.TEXT_NODE && node.textContent!.includes(searchText)) {
                node.textContent = node.textContent!.replace(searchText, newText);
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                replaceTextInElements(searchText, newText, node as Element);
            }
        });
    };

    return {
        remove (element: HTMLElement) {
            element.remove();
        },
        changeText (from: string, to: string) {
            return (element: HTMLElement) => {
                replaceTextInElements(from, to, element);
            };
        },
    };
};


export const rule = function () {
    const _classes: Array<string>    = [];
    const _attributes: Array<string> = [];
    let _text: string                = '';
    let _tag: string                 = '';

    const _rules = {
        class (className: string) {
            _classes.push(className);
            return _rules;
        },
        attribute (attributeName: string) {
            _attributes.push(attributeName);
            return _rules;
        },
        tag (tagName: string) {
            _tag = tagName.toLowerCase();
            return _rules;
        },
        hasText (text: string) {
            _text = text;
            return _rules;
        },
        get (element: HTMLElement): boolean {
            return (_tag ? element.localName.toLowerCase() === _tag : true) &&
                (_text ? !!element.textContent!.match(_text) : true) &&
                _classes.every((classItem) => element.classList.contains(classItem)) &&
                _attributes.every((attr) => element.getAttribute(attr) !== null);
        },
    };

    return _rules;
};

export const mutateDom = function mutateDom (handlers: Array<(element: HTMLElement) => void>) {
    const root = document.querySelector('app-root');
    if (root) {
        const _conditions: Array<{ get: () => boolean }>                = [];
        const _rules: Array<{ get: (element: HTMLElement) => boolean }> = [];
        let _in: string                                                 = 'app-root';

        const mutationObserver = new MutationObserver(() => {
            if (_conditions.every(condition => condition.get())) {
                const root = document.querySelector(_in);
                if (root) {
                    const allElements = root.querySelectorAll('*');
                    allElements.forEach((element: Element) => {
                        if (_rules.some((rule) => rule.get(element as HTMLElement))) {
                            handlers.forEach((handler) => handler(element as HTMLElement));
                        }
                    });
                }
            }
        });
        mutationObserver.observe(root, { subtree: true, childList: true });

        const _exec = {
            // conditions
            when (condition: { get: () => boolean }) {
                _conditions.push(condition);
                return _exec;
            },
            // selector
            to (rule: { get: (element: HTMLElement) => boolean }) {
                _rules.push(rule);
                return _exec;
            },
            // Optimization
            in (selector: string) {
                _in = selector;
                return _exec;
            },
        };

        return _exec;
    }
};