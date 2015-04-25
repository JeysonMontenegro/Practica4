
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var engines = require('consolidate');
var routes=require('./routes/index');
var users = require('./routes/users');
var ABC_Buses=require('./routes/ABC_Buses'), 
Dist_Rutas_Buses=require('./routes/Dist_Rutas_Buses'),
Reserva_Ticket=require('./routes/Reserva_Ticket'),
Pago_Ticket=require('./routes/Pago_Ticket'),
Consulta_Viajes=require('./routes/Consulta_Viajes');
var socket = require('socket.io');
var pg = require('pg');

var conString = "postgres://user_1:12345@localhost/Practica4";

var express = require('express')
  , http = require('http');
var app = express();
app.set('port', process.env.PORT || 8080);

var server = http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

var io = socket.listen(server);

var exec = require('child_process').exec,
    child;



app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.engine('html', engines.mustache);
app.set('view engine', 'html');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());


app.use('/', routes);
app.use('/ABC_Buses', ABC_Buses);
app.use('/Dist_Rutas_Buses', Dist_Rutas_Buses);
app.use('/Reserva_Ticket', Reserva_Ticket);
app.use('/Consulta_Viajes', Consulta_Viajes);
app.use('/Pago_Ticket', Pago_Ticket);

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

io.sockets.on('connection', function (socket) {
	socket.on('Q1', function (data1) {

		var client = new pg.Client(conString);
		var qu='select TO_CHAR(Fecha, \'dd/MM/YYYY\'),Total From Factura where ID_Factura='+data1.msg+';'
		client.connect(function(err) {
  		if(err) {
   		 return console.error('could not connect to postgres', err);
 		 }

  		client.query(qu, function(err, result) {
  		  if(err) {
    		  return console.error('error running query', err);
   			 }
  		  console.log(result);
    		io.sockets.emit('res1', { msg: result});
   		 client.end();
 		 });
		});     
	});

	socket.on('Query2', function (data1) {

		var client = new pg.Client(conString);
		var qu="SELECT Cliente.Nombre,Cliente.Nit FROM Cliente INNER JOIN Factura ON Factura.ID_Cliente = Cliente.ID_CLiente and Factura.ID_Factura="+data1.msg+";"
		console.log('llegoasdasdasd');
		client.connect(function(err) {
  		if(err) {
   		 return console.error('could not connect to postgres', err);
 		 }
  		client.query(qu, function(err, result) {
  		  if(err) {
    		  return console.error('error running query', err);
   			 }
  		  console.log(result);
    		io.sockets.emit('res2', { msg: result});
   		 client.end();
 		 });
		});     
	});
	
socket.on('Query3', function (data1) {

		var client = new pg.Client(conString);
		var qu= 'select rd.NO_Tramo,d.Nombre,rd.Distancia_Origen,(sub2.Costo_Kilometro*rd.Distancia_Origen) from Ruta_destino rd,Destino d, (select ID_ruta from ticket where ID_Factura = 1 )as sub1,(Select Costo_Kilometro from bus where ID_bus=(select ID_bus  from Reservacion INNEr Join (select ID_Reservacion  from ticket where ID_Factura =  1 ) as sub1 ON Reservacion.ID_Reservacion=sub1.ID_reservacion))as sub2 WHERE sub1.ID_Ruta=rd.ID_Ruta and d.ID_Destino=rd.ID_DEstino;'
			
		client.connect(function(err) {
  		if(err) {
   		 return console.error('could not connect to postgres', err);
 		 }
  		client.query(data1.msg, function(err, result) {
  		  if(err) {
    		  return console.error('error running query', err);
   			 }
  		  console.log(result);
    		io.sockets.emit('res3', { msg: result});
   		 client.end();
 		 });
		});     
	});

	socket.on('Query4', function (data1) {

		var client = new pg.Client(conString);
		client.connect(function(err) {
  		if(err) {
   		 return console.error('could not connect to postgres', err);
 		 }
  		client.query(data1.msg, function(err, result) {
  		  if(err) {
    		  return console.error('error running query', err);
   			 }
  		  console.log(result);
    		//io.sockets.emit('res4', { msg: result});
   		 client.end();
 		 });
		});     
	});
	
socket.on('Q5', function (data1) {

		var client = new pg.Client(conString);
		client.connect(function(err) {
  		if(err) {
   		 return console.error('could not connect to postgres', err);
 		 }
  		client.query(data1.msg, function(err, result) {
  		  if(err) {
    		  return console.error('error running query', err);
   			 }
  		  console.log(result);
    		io.sockets.emit('res5', { msg: result});
   		 client.end();
 		 });
		});     
	});



















	
	});


function Connect(Query) {
var client = new pg.Client(conString);
client.connect(function(err) {
  if(err) {
    return console.error('could not connect to postgres', err);
  }
  client.query(Query, function(err, result) {
    if(err) {
      return console.error('error running query', err);
    }
    console.log(result);
    //output: Tue Jan 15 2013 19:12:47 GMT-600 (CST)
    client.end();
    return result;
  });
});

}
module.exports = app;



