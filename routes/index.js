/* Routes for index.js */

const express = require('express');
const router = express.Router();
const baseDir = process.cwd(); // prepend to any required files so we use absolute instead or relative paths

router.get("/", function (req, res) {
	res.render('index');
});

module.exports = router;
