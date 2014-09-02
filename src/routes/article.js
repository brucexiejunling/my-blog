var article = require('../business/article');

module.exports = function(router) {
	router.get('/article/:id', function(req, res) {
		var role = req.session.adminId ? 'admin' : 'visitor';
		res.render('article', {aid: req.params.id, role: role});
	});

	router.post('/load-article', function(req, res) {
		var articleView = req.session.adminId ? 'admin/article-details' : 'article-details';
		article.getArticleById(req.body.aid, function(result) {
			if(!result.error) {
				res.render(articleView, {article: result.article}, function(err, html) {
					var error = !!err ? err : '';
					res.send({error: error, html: html});
				});
			} else {
				res.render('404', function(err, html) {
					var error = !!err ? err : '';
					res.send({error: error, html: html});
				});
			}
		});
	});

	router.post('/load-articles', function(req, res) {
		var viewType = req.body.view // 'article-list', 'title-list'
		var query = {
			type: req.body.type,
			tag: req.body.tag,
			page: req.body.page,
			limit: req.body.limit 
		};

		article.getArticles(query, function(result) {
			if(!result.error) {
				res.render(viewType, {articles: result.articles, page: req.body.page}, function(err, html) {
					var error = !!err ? err : '';
					res.send({error: error, html: html, total: result.count});
				});
			} else {
				res.send({error: result.error});
			}
		});
	});

	router.post('/article', function(req, res) {
		var aid = req.body.aid, tags = req.body.tags, type = req.body.type;
		var newArticle = {
			title: req.body.title,
			type: type,
			tags: tags,
			contentText: req.body.contentText,
			contentHtml: req.body.contentHtml,
			date: new Date()
		};
		article.saveArticle(aid, newArticle, function(result) {
			res.send(result);
		});
	});

	router.post('/comment', function(req, res) {
		var date = new Date();
		var newComment = {
			aid: req.body.aid,
			username: req.body.username,
			email: req.body.email,	
			content: req.body.content,
			date: date
		};

		article.saveNewComment(newComment, function(result) {
			res.send(result);
		});
	});

	router.delete('/delete-article/:id', function(req, res) {
		article.deleteArticle(req.params.id, function(result) {
			res.send(result);
		});
	});

	router.delete('/delete-comment/:id', function(req, res) {
		article.deleteComment(req.params.id, function(result) {
			res.send(result);
		});
	})
}