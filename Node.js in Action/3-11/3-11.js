/**
 * Created by Abbey on 14-10-7.
 */
var events = require('events');
var net = require('net');
var channel = new events.EventEmitter();
channel.clients = {};
channel.subscriptions = {};

channel.on('join', function (id, client) {
//    console.log('join');
    this.clients[id] = client;
    this.subscriptions[id] = function (senderId, message) {
//        console.log('subscription');
        if(id != senderId) {
            this.clients[id].write(message);
        }
    }
    this.on('broadcast', this.subscriptions[id]);
});

var server = net.createServer(function (client) {
    var id = client.remoteAddress + ':' + client.remotePort;
    //console.log(ids);
//    client.on('connect', function () {
//        channel.emit('join', id, client);
//    });
    channel.emit('join', id, client);
    client.on('data', function (data) {
        console.log("data");
        data = data.toString();
        channel.emit('broadcast', id, data);
    });
});
server.listen(8989);