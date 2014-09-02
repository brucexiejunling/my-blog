var database = require('./database');

var loadPageByName = function(pageName, callback) {
	var articles = [], tags = [], count = 0;
	database.getCollection('articles').find({type: pageName}, {'limit': 16}, function(result) {
		if(!result.error) {
			articles = result.articles;
			database.getCollection('articles').count({type: pageName}, function(result) {
				count = result.count;
				if(pageName === 'tech') {
					database.getCollection('tags').find({}, {}, function(result) {
						for(var i in result.tags) {
							tags.push(result.tags[i].name);
						}
						if(callback) {
							callback({error: '', articles: articles, tags: tags, count: count});
						}
					});
				} else {
					if(callback) {
						callback({error: '', articles: articles, tags: tags, count: count});
					}
				}
			});
		} else {
			if(callback) {
				callback({error: result.error});
			}
		}
	});
};

module.exports = {
	loadPageByName: loadPageByName
};