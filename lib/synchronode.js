/**
 * Synchronode
 * Copyright 2011 Troy Whiteley <troy@somanyscientists.com>
 * https://github.com/dawnerd/Synchronode
 */
 
var net = require('net'),
    colors = require('colors'),
    events = require('events');

var Synchronode = function Synchronode(access_token) {
  var connections = [],
      currentServer = null,
      self = this;
            
  function Connection(port, host) {
    var server = new net.Socket(),
        connected = false;
    
    function retry() {
      if(connected) return;
      server.connect(port, host);
    }
    
    server.on('error', function connect_error(err) {
      console.log('ERR:'.bold.red.inverse+' '+err.message+' - '+host+':'+port);
      self.emit('error', err);
      setTimeout(retry, 5000);
    });
    
    server.on('connect', function connect_success() {
      connected = true;
      console.log('Connected:'.bold.green.inverse+' '+host+':'+port);
      self.emit('connect', host, port);
    });
    
    self.on('send', function connect_send(data) {
      console.log('sent', data)
      server.write(data);
    });
    
    retry();
  }
  
  this.create =  function create(port) {
    currentServer = net.createServer();
    currentServer.listen(port);
    
    currentServer.on('connection', function(socket) {
      socket.on('data', function connect_data(data) {
        try{
          var parsed = JSON.parse(data);
          self.emit('data', parsed);
        } catch(err) {
          self.emit('error', err, data);
        }
      });
    });
  };
  this.connect = function connect(servers, ip) {
    var address = currentServer.address();
    for(var i = servers.length; i--;) {
      var server = servers[i];
      //we don't want to connect to this process
      if(server.host === ip && server.port === address.port) continue;
      connections.push(new Connection(server.port, server.host));
    }
  };
  this.send = function send(data) {
    console.log('sending');
    data.access_token = access_token;
    data.timestamp = +new Date();
    var encoded = JSON.stringify(data);
    
    console.log(encoded);
    self.emit('send', encoded);
  };
};

Synchronode.prototype = new events.EventEmitter;

module.exports = Synchronode;