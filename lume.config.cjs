/** @type {import('@lume/cli/config/getUserConfig.js').UserConfig} */
module.exports = {
	useBabelForTypeScript: true,
	importMap: {
		imports: {
			lowclass: '/node_modules/lowclass/dist/index.js',
			'solid-js': '/node_modules/solid-js/dist/solid.js',
			'solid-js/web': '/node_modules/solid-js/web/dist/web.js',
			'solid-js/html': '/node_modules/solid-js/html/dist/html.js',
			'solid-js/store': '/node_modules/solid-js/store/dist/store.js',
		},
	},
}
