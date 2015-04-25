var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('Reserva_Ticket.html');
});

module.exports = router;
