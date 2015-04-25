var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('Consulta_Viajes.html');
});

module.exports = router;
