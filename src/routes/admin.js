var admin = require('../business/admin');
var article = require('../business/article');

var verify = function(req, res, next) {
	if(!req.session.adminId) {
		res.redirect('/login');
	} else {
		next();
	}
};

module.exports = function(router) {
	router.get('/login', function(req, res) {
		res.render('admin/login');
	});

	router.get('/edit', verify, function(req, res) {
		res.render('admin/edit', {
	  	article: {
	  		_id: '', 
	  		type: '',
	  		title: '', 
	  		contentText: '', 
	  		contentHtml: '',
	  		tags: []
	  	}
	  });
	});	

	router.get('/edit/:id', verify, function(req, res) {
		article.getArticleById(req.params.id, function(result) {
			if(!result.error) {
				res.render('admin/edit', {article: result.article});
			} else {
				res.render('404');
			}
		})
	});

	router.post('/login', function(req, res) {
		if(req.body.userId === '123900') {
			req.session.adminId = '123900';
			res.send({error: ''});
		} else {
			res.send({error: 'invalid admin id'});
		}
	});

	router.post('/logout', function(req, res) {
		req.session.adminId = '';
		res.send({error: ''});
	});

	router.post('/upload', function(req, res) {
		admin.uploadImage(req, function(result) {
			res.send(result);
		});
	});
};