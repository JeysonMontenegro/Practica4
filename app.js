
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
	//GET RAM
	socket.on('RAM', function (data1) {
 			var fs = require('fs'); 
			fs.readFile('/proc/meminfo', 'utf8', function (err,data) {
 			if (err) {
					
    					return console.log(err);
 			          }
			io.sockets.emit('RAMOK', { msg: data});
	                io.sockets.emit('RAMOK', { msg1: 'asd'});
                        });
	});


	// KILL PROCESS
	socket.on('KILL', function (data1) {
		var execSync = require('exec-sync');
		var command='kill -9 '+data1.msg;
		var cpu = execSync(command);	
	});
	
	// GET CPU STATUS

	socket.on('CPU0', function (data1) {
				var execSync = require('exec-sync');
				var cpu = execSync('top -bn 1 | awk \'NR>7{s+=$9} END {print s/4}\' ');	
				io.sockets.emit('CPUO0K', { msg: cpu});
	 });


	// GET PROC STATUS 
	socket.on('PROC', function (data1) {
        	
		var execSync = require('exec-sync');
		var proc = execSync('ps -aux | awk \'FNR>1{print $2"-"$1"-"$3"-"$4}\'');
		var arregloLineas=proc.split('\n');
		var totalProcesos=arregloLineas.length;
		var i = 0;
		var PID;
		var arregloColumnas;
		var procstr;
		var temp1;
		var temp2;
		var R,S,D,Z;
		var status="";
		var totalProcess="";
			for (i = 0; i < totalProcesos-1; i++) {
				procstr=arregloLineas[i];
				arregloColumnas=procstr.split("-");
				PID=arregloColumnas[0];
			
				  try {
    					proc = execSync('awk \'FNR<3{print $2}\' /proc/'+PID+'/status');
					temp1=proc.split('\n');
					totalProcess+=arregloColumnas[0]+'$'+arregloColumnas[1]+'$'+temp1[1]+'$'+arregloColumnas[2]+'$'+arregloColumnas[3]+'$'+temp1[0]+'\n';
					status+=temp1[1];
  				} catch (e) {
    					console.log(e);
  					}
			}
			R=(status.match(/R/g)||[]).length;
			S=(status.match(/S/g)||[]).length;
			D=(status.match(/D/g)||[]).length;
			Z=(status.match(/Z/g)||[]).length;
			var total=R+S+D+Z;
			var envioStatus=total+'-'+R+'-'+S+'-'+D+'-'+Z;
			io.sockets.emit('SUMMARYOK', { msg: envioStatus});
			io.sockets.emit('PROCESOSOK', { msg: totalProcess});

		});
	// GET STATUS ONLY SUMMARY PROCESS (ACTUALLY ISN'T IN USE)
	socket.on('SUMMARY', function (data1) {
		var execSync = require('exec-sync');
		var command='top -bn 1 | awk \'FNR==2 {print $2"-"$4"-"$7"-"$10"-"$13}\' ';
		var cpu = execSync(command);
		console.log('entro summary');
		console.log(cpu);
		io.sockets.emit('SUMMARYOK', { msg: cpu});
	});

	socket.on('PRUEBAPOSTGRE', function (data1) {

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
    		io.sockets.emit('res', { msg: result});
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



