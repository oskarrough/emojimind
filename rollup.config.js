import babel from 'rollup-plugin-babel'

export default {
	entry: 'src/index.js',
	plugins: [babel({
		babelrc: false,
		presets: ['es2015-rollup']
	})],
	moduleName: 'emojimind',
	format: 'umd',
	sourceMap: true,
	dest: 'dist/bundle.js'
}
