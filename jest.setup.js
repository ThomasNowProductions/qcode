require('@testing-library/jest-dom');

// The i18n mock is now imported from src/__mocks__
require('./src/__mocks__/i18next');

// Mock window.matchMedia for jsdom
if (typeof window !== 'undefined' && !window.matchMedia) {
	window.matchMedia = function (query) {
		return {
			matches: false,
			media: query,
			onchange: null,
			addListener: function () {},
			removeListener: function () {},
			addEventListener: function () {},
			removeEventListener: function () {},
			dispatchEvent: function () { return false; },
		};
	};
}
