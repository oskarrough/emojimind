import babel from 'rollup-plugin-babel'

export default {
	entry: 'src/index.js',
	format: 'iife',
	moduleName: 'emojimind',
	plugins: [babel({
		babelrc: false,
		presets: ['es2015-rollup']
	})],
	dest: 'src/bundle.js'
}

