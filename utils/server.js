/**
 * Module dependencies.
 */

var app = require('../app'),
	debug = require('debug')('ternopel:server'),
	https = require('https'),
	fs = require('fs');

var port;
var server;

 var options = {
		key:	fs.readFileSync('./support/cert/key.pem','utf8'),
		cert:	fs.readFileSync('./support/cert/key-cert.pem','utf8')
	};
 
/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val) {
  var myport = parseInt(val, 10);

  if (isNaN(myport)) {
    // named pipe
    return val;
  }

  if (myport >= 0) {
    // port number
    return myport;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
  debug('Listening on ' + bind);
}

/**
 * Get port from environment and store in Express.
 */

port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTPS server.
 */
server = https.createServer(options,app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);


