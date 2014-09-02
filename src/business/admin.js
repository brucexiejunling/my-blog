var fs = require('fs');
var config = require('../config/common');

var uploadImage = function(req, callback) {
	var fstream;
  req.pipe(req.busboy);
  req.busboy.on('file', function (fieldname, file, filename) {
    fstream = fs.createWriteStream(config.uploadPath + filename);
    file.pipe(fstream);
    fstream.on('close', function () {
			var result = {error: '', 'url': '/upload/' + filename};
			callback(result);
    });
  });
};

module.exports = {
	uploadImage: uploadImage
};