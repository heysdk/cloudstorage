cloudstorage
============

**cloudstorage** is a toolkit for cloudstorage, support oss etc.

aliyun-oss
----------

	// your oss config
	var cfg_oss = { accessKeyId: 'your key id', secretAccessKey: 'your access key', endpoint: 'your endpoint' };
	
	var ALYOSS = require('../oss').ALYOSS;
	var oss = new ALYOSS(cfg_oss);
	
	// your oss's bucket
	var ossBucket = 'sancoc';
	
	// readFile
	oss.readFile(ossBucket, 'test/abc.txt', function (err, data) {
		if (err) {
			return ;
		}
	
		var str = data.toString();
	});

	// writefile
	oss.writeFile(ossBucket, 'test/abc1.txt', 'hello world', function (err) {
	
	});
	
	// readdir
	oss.readDir(ossBucket, 'test', function (err, files) {
		if (err) {
			return ;
		}
	
		for (var i = 0; i < files.length; ++i) {
	
		}
	});
	
	// updfile
	oss.updFile(ossBucket, 'test/001.txt', '001.txt');
	oss.updFile(ossBucket, 'test/002.txt', '002.txt');
	oss.updFile(ossBucket, 'test/002.txt', '002.txt');
