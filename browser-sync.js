var bs = require('browser-sync').create()

bs.init({
	server: ['./src', 'dist'],
	ghostMode: false,
	notify: false,
	ui: false
})

bs.watch(['src/*.html', 'dist/*.js', 'src/*.css']).on('change', bs.reload)

