export default [
	{
		input: './.dist/lib.foundation.js',
		output: {
			format: 'es',
			file: './.rollup/lib.foundation.js',
			paths: {
				'@zone09.net/foundation': './lib.foundation.js',
				'@zone09.net/paperless': './lib.paperless.js',
				'@zone09.net/hac': './lib.hac.js',
			 }
		},
	},
]
