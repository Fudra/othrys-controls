var express = require('express');
var router = express.Router();

var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var fs = require('fs');
var url = require('url');
var slug = require('slug');

/* set slug mode */
slug.defaults.mode ='rfc3986';

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index');
});


router.post('/upload', multipartMiddleware, function (req, res, next) {
    console.log(req.body, req.files);

    var tmpPath = req.files.file.path;
    var responsePath = 'music/' + slug(req.files.file.originalFilename);
    var targetPath = './public/' + responsePath;

    // TODO: Make it Clean!!
    var globalPath = "http://localhost:3000/";

    console.log(__dirname);
    fs.rename(tmpPath, targetPath, function (err) {
        if (err) {
            res.status(500);
            res.send(err);
        }

        res.json({
            status: {
                code: 200
            },
            file: {
                path: responsePath,
                globalPath: globalPath + responsePath,
                size: req.files.file.size
            }
        });

        /**
         * Unlink not necessary , because of the rename function
         * rename moves a file to a different location
         */
        //fs.unlink(tmpPath, function (err) {
        //    if (err) {
        //        //throw err;
        //        res.status(500);
        //        res.send(err);
        //    }
        //})
    });

});

module.exports = router;
