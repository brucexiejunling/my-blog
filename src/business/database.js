var mongo = require('mongoskin');
var config = require('../config/common');
var db = null;

// singleton
var getDb = function() {
	if(!db) {
		db = mongo.db(config.dbPath, {native_parser:true});
		if(config.dist) {
			db.authenticate(config.username, config.password, function(err, result) {
				console.log('authenticate', err, result)
			});
		}
	}
	return db;
};

var getCollection = function(coName) {
	var db = getDb();
	var collection =  new MyCollection(coName, db.collection(coName));
	return collection;
};

var findOne = function(query, callback) {
	var name = this.name;
	this.collection.find(query).toArray(function(err, result) {
		if(!err) {
			if(callback) {
				var data = {
					error: ''
				};
				data[name.substring(0, name.length - 1)] = result.length > 0 ? result[0] : null;
				callback(data);
			}
		} else {
			if(callback) {
				callback({error: err});
			}
		}
	});
};

var find = function(query, option, callback) {
	var name = this.name;
	this.collection.find(query, option).sort({'_id': -1}).toArray(function(err, result) {
		if(!err) {
			if(callback) {
				var data = {
					error: ''
				};
				data[name] = result;
				callback(data);
			}
		} else {
			if(callback) {
				callback({error: err});
			}
		}
	});
}

var addOne = function(newDoc, callback) {
	var name = this.name;
	this.collection.insert(newDoc, function(err, result) {
		if(err === null) {
			if(callback) {
				var data = {
					error: ''
				};
				data[name.substring(0, name.length - 1)] = result[0];
				callback(data);
			}
		} else {
			if(callback) {
				callback({error: err});
			}
		}
	});
};

var remove = function(query, callback) {
	this.collection.remove(query, function(err, result) {
		if(callback) {
			var error = err ? err : '';
			callback({error: error});
		}
	});
};

var deleteOne = function(query, callback) {
	var name = this.name;
	this.collection.remove(query, function(err, result) {
		if(!err) {
			if(callback) {
				var data = {
					error: ''
				};
				data[name.substring(0, name.length - 1)] = result[0];
				callback(data);
			}
		} else {
			if(callback) {
				callback({error: err});
			}
		}
	});
};

var saveOne = function(doc, callback) {
	var name = this.name;
	this.collection.save(doc, function(err, result){
		if(!err) {
			if(callback) {
				var data = {
					error: ''
				};
				if(doc._id) {
					data[name.substring(0, name.length - 1)] = doc;
				} else {
					data[name.substring(0, name.length - 1)] = result;
				}
				callback(data);
			}
		} else {
			if(callback) {
				callback({error: err});
			}
		}
	});
};

var count = function(query, callback) {
	this.collection.count(query, function(err,result) {
		if(!err) {
			if(callback) {
				callback({error: '', count: result});
			}
		} else {
			if(callback) {
				callback({error: err});
			}
		}
	});
};

var MyCollection = function(name, collection) {
	this.name = name;
	this.collection = collection;
	this.findOne = findOne;
	this.find = find;
	this.addOne = addOne;
	this.remove = remove;
	this.saveOne = saveOne;
	this.deleteOne = deleteOne;
	this.count = count;
}

module.exports = {
	getCollection: getCollection
};