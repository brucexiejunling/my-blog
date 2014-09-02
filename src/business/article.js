var database = require('./database');
var BSON = require('mongodb').BSONPure; 

var getArticleById = function(aid, callback) {
	var articleId = BSON.ObjectID.createFromHexString(aid);
	var article;
	database.getCollection('articles').findOne({'_id': articleId}, function(result) {
		if(!result.error)	{
			article = result.article;
			if(article) {
				getArticleComments(aid, function(result) {
					article.comments = result.comments;
					if(callback) {
						article._id = article._id.toString();
						callback({error: '', article: article});
					}
				});	
			} else {
				callback({error: 'not found'});
			}
		} else {
			if(callback) {
				callback({error: result.error});
			}
		}
	});
};

var getArticleComments = function(aid, callback) {
	database.getCollection('comments').find({'aid': aid}, {}, callback);
};

var getArticles = function(query, callback) {
	var queryInfo = {};
	var limit = query.limit;
	var skip = (query.page - 1) * (limit - 1);
	var articles = [], count = 0;

	if(query.type === 'tech') {
		queryInfo = query.tag === '' ? {type: query.type} : {type: query.type, tags: query.tag};
	} else {
		queryInfo = {type: query.type};
	}

	database.getCollection('articles').find(queryInfo, {'skip': skip, 'limit': limit}, function(result) {
		if(!result.error) {
			articles = result.articles;
			database.getCollection('articles').count(queryInfo, function(result) {
				if(!result.error) {
					count = result.count;
				}
				if(callback) {
					callback({error: '', articles: articles, count: count});
				}
			});
		} else {
			if(callback) {
				callback({error: result.error});
			}
		}
	});
};

var saveArticle = function(aid, article, callback) {
	var isNew = !aid;
	if(!isNew) {
		var articleId = BSON.ObjectID.createFromHexString(aid);
		article._id = articleId;
	}
	database.getCollection('articles').saveOne(article, function(result) {
		if(!result.error) {
			var aid = result.article._id.toString();
			if(article.type === 'tech' && isNew) {
				saveNewTags(aid, article.tags);
			} else if(article.type === 'tech') {
				deleteTagsByAid(aid, function() {
					saveNewTags(aid, article.tags);
				});
			}
		}
		if(callback) {
			result.article._id = result.article._id.toString();
			callback(result);
		}
	});
};

var saveNewTags = function(aid, tags) {
	for(var i in tags) {
		(function(i) {
			var newTag = {
				name: tags[i],
				aids: [aid]
			};

			database.getCollection('tags').findOne({'name': newTag.name}, function(result) {
				if(!result.error) {
					var existTag = result.tag;
					if(existTag)	{
						var tid = existTag._id;
						newTag._id = tid;
						[].push.apply(newTag.aids, existTag.aids);
					}
					database.getCollection('tags').saveOne(newTag, function() {});
				}
			})

		})(i);
	}
};

var deleteTagsByAid = function(aid, callback) {
	var tags = [];
	database.getCollection('tags').find({'aids': aid}, {}, function(result) {
		if(!result.error) {
			tags = result.tags;
			console.log('tags', tags);
			for(var i in tags) {
				var tid = tags[i]._id;
				var tagName = tags[i].name;
				var aids = tags[i].aids;
				if(aids.length === 1) {
					database.getCollection('tags').deleteOne({'_id': tid}, function() {});
				} else {
					aids.splice(aids.indexOf(aid), 1);
					database.getCollection('tags').saveOne({'_id': tid, 'name': tagName, aids: aids}, function() {});
				}
			}
			if(callback) {
				callback();
			}
		}
	});
};

var saveNewComment = function(newComment, callback) {
	database.getCollection('comments').addOne(newComment, function(result) {
		if(!result.error) {
			if(callback) {
				var comment = result.comment;
				comment._id = comment._id.toString();
				callback({error: '', comment: comment});
			}
		} else {
			if(callback) {
				callback({error: result.error});
			}
		}
	});
};

var deleteArticle = function(aid, callback) {
	var articleId = BSON.ObjectID.createFromHexString(aid);
	database.getCollection('articles').deleteOne({'_id': articleId}, function(result) {
		deleteTagsByAid(aid, function() {});
		deleteCommentsByAid(aid, function() {});
		if(callback) {
			callback(result);
		}
	});
};

var deleteComment = function(cid, callback) {
	var commentId = BSON.ObjectID.createFromHexString(cid);
	database.getCollection('comments').deleteOne({'_id': commentId}, callback);
};

var deleteCommentsByAid = function(aid, callback) {
	database.getCollection('comments').remove({'aid': aid}, callback);
};

module.exports = {
	getArticleById: getArticleById,
	getArticles: getArticles,
	saveArticle: saveArticle,
	deleteArticle: deleteArticle,
	saveNewComment: saveNewComment,
	deleteComment: deleteComment
};
