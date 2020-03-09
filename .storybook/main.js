const path = require('path');

module.exports = {
	stories: ['../src/8bit/**/*.stories.jsx'],
	addons: [
		'@storybook/preset-create-react-app',
		{
			name: '@storybook/addon-docs',
			options: {
				configureJSX: true,
			},
		},
	],
};
