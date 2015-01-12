/**
 * Created by zhs007 on 2014/12/13.
 */

var ALY = require('aliyun-sdk');

// cfg = { accessKeyId: xxx, secretAccessKey: xxx, endpoint:xxx }
function init(cfg) {
    ALY.config.update({
        accessKeyId: cfg.accessKeyId,
        secretAccessKey: cfg.secretAccessKey
    });

    var oss = new ALY.OSS({
        endpoint: cfg.endpoint,
        apiVersion: '2013-10-15'
    });

    return oss;
}

// callback(err, data)
function writeFile(bucket, filename, data, callback) {
    var arr = filename.split('\\');
    filename = arr.join('/');
    var oss = this.oss;

    oss.putObject({
            Bucket: bucket,
            Key: filename,
            Body: data,
            ContentType: 'application/octet-stream'
        }, callback);
}

// callback(err, data)
function readFile(bucket, filename, callback) {
    var arr = filename.split('\\');
    filename = arr.join('/');
    var oss = this.oss;

    oss.getObject({
        Bucket: bucket,
        Key: filename
    }, callback);
}

function lstObjects(oss, bucket, path, marker, callback) {
    var arr = path.split('\\');
    path = arr.join('/');

    oss.listObjects({
        Bucket: bucket,
        MaxKeys: '100',
        Prefix: path + '/',
        Marker: marker,
        Delimiter: ''
    }, function (err, data) {
        if (err) {
            callback(err, null);

            return ;
        }

        var files = [];
        if (data.hasOwnProperty('Contents')) {
            var max = data.Contents.length;
            for (var i = 0; i < max; ++i) {
                files[i] = data.Contents[i].Key;
            }
        }

        callback(null, files);

        if (data.hasOwnProperty('NextMarker')) {
            lstObjects(bucket, path, data.NextMarker, callback);
        }
    });
}

// callback(err, files)
function readDir(bucket, path, callback) {
    var oss = this.oss;

    lstObjects(oss, bucket, path, '', callback);
}

function updFile(bucket, filename, data) {
    this.updfiles.push({filename: filename, data: data});

    if (!this.isUpdateing) {
        this.isUpdateing = true;
        var cuross = this;
        this.writeFile(bucket, filename, data, function (err, data) {
            cuross.onUpdEnd(bucket);
        });
    }
}

function onUpdEnd(bucket) {
    this.updfiles.splice(0, 1);

    if (this.updfiles.length <= 0) {
        this.isUpdateing = false;
    }
    else {
        var cuross = this;
        var filename = this.updfiles[0].filename;
        var data = this.updfiles[0].data;
        this.writeFile(bucket, filename, data, function (err, data) {
            cuross.onUpdEnd(bucket);
        });
    }
}

function ALYOSS(cfg) {
    this.oss = init(cfg);
    this.updfiles = [];
    this.isUpdateing = false;
}

ALYOSS.prototype.type = 'ALYOSS';
ALYOSS.prototype.writeFile = writeFile;
ALYOSS.prototype.readFile = readFile;
ALYOSS.prototype.readDir = readDir;
ALYOSS.prototype.updFile = updFile;
ALYOSS.prototype.onUpdEnd = onUpdEnd;

exports.ALYOSS = ALYOSS;