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
synch.create(2156);
synch.connect(servers, '127.0.0.1');

synch.on('data', function test() {
  console.log('test');
});

synch.on('error', function(err) {
  
});

function sendTest() {
  synch.send({
    test: 'true'
  })
}

setInterval(sendTest, 2000)