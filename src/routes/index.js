var home = require('../business/home');

module.exports = function(router) {
	router.get('/', function(req, res) {
		var role = req.session.adminId ? 'admin' : 'visitor';
		res.render('index', {role: role});
	});

	router.get('/about-me', function(req, res) {
		res.render('me');
	});

	router.post('/load-page', function(req, res) {
		home.loadPageByName(req.body.pageName, function(result) {
			if(!result.error) {
				res.render(req.body.pageName, {
					total: result.count,
					articles: result.articles,
					tags: result.tags,
					page: 1
				}, function(err, html) {
					var error = !!err ? err : '';
					res.send({error: error, html: html});
				});
			} else {
				res.render('404', function(err, html) {
					var error = !!err ? err : '';
					res.send({error: error, html: html});
				})
			}
		});
	});
};