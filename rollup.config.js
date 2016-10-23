import babel from 'rollup-plugin-babel'

export default {
	moduleName: 'emojimind',
	entry: 'src/index.js',
	format: 'umd',
	plugins: [babel({
		babelrc: false,
		presets: ['es2015-rollup']
	})],
	sourceMap: true,
	dest: 'dist/bundle.js'
}
