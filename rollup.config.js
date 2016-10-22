import babel from 'rollup-plugin-babel'

export default {
	entry: 'src/index.js',
	format: 'iife',
	moduleName: 'emojimind',
	plugins: [babel()],
	dest: 'src/bundle.js'
}

