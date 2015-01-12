/**
 * Created by zhs007 on 2014/12/13.
 */

var fs = require('fs');
var path = require('path');
var fileutils = require('heyutils').fileutils;

function init(cfg) {
    return true;
}

// callback(err, data)
function writeFile(bucket, filename, data, callback) {
    fs.writeFile(path.join(bucket, filename), data, callback);
}

// callback(err, data)
function readFile(bucket, filename, callback) {
    fs.readFile(path.join(bucket, filename), callback);
}

// callback(err, files)
function readDir(bucket, dir, callback) {
    var destdir = path.join(bucket, dir);
    fs.readdir(destdir, function (err, files) {
        if (err) {
            callback(err, []);

            return ;
        }

        var outputs = [];
        for (var i = 0; i < files.length; ++i) {
            var curpath = path.join(bucket, dir, files[i]);
            if (fileutils.isDirectory(curpath)) {
                curpath = path.join(dir, files[i]);
                readDir(bucket, curpath, callback);
            }
            else {
                outputs.push(path.join(dir, files[i]));
            }
        }

        callback(err, outputs);
    });
}

function LOCALFILE(cfg) {
}

LOCALFILE.prototype.type = 'LOCALFILE';
LOCALFILE.prototype.writeFile = writeFile;
LOCALFILE.prototype.readFile = readFile;
LOCALFILE.prototype.readDir = readDir;

exports.LOCALFILE = LOCALFILE;