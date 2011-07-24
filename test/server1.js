var Synchronode = require('../lib/synchronode');

var servers = [
  {
    'host': '127.0.0.1',
    'port': 2155
  },
  {
    'host': '127.0.0.1',
    'port': 2156
  }
];

var synch = new Synchronode('87t3i4giuaerggkuave58i');
console.log(synch)
synch.create(2155);
synch.connect(servers, '127.0.0.1');

synch.on('error', function(err) {
  console.log(err);
});

synch.on('data', function test(data) {
  console.log('data')
  console.log(data);
});