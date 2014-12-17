var _ = require('lodash');

var WebSocketManager = function(webSocket) {
    this.webSocket = webSocket;

    var self = this;
    this.webSocket.onopen = function() {
        self.isOpen = true;
        if (self.onSocketOpen) {
            self.onSocketOpen();
        }
    };
};

WebSocketManager.create = function(webSocket) {
    return new WebSocketManager(webSocket);
};

WebSocketManager.prototype.applyFilter = function(clientId) {
    if (this.clientId) {
        this.webSocket.send('unsubscribe:' + this.clientId);
    }

    if (this.isOpen) {
        this.clientId = clientId;
        this.webSocket.send(this.clientId);                        // for the pre-unsubscribe version of Tv
        this.webSocket.send('subscribe:' + this.clientId);
    }
};

WebSocketManager.prototype.clearFilter = function() {
    this.applyFilter('*');
};

WebSocketManager.prototype.resume = function() {
    this.webSocket.onmessage = this.onMessageCallback;
};

WebSocketManager.prototype.pause = function() {
    this.webSocket.onmessage = null;
};

WebSocketManager.prototype.onMessage = function(fn) {
    this.webSocket.onmessage = this.onMessageCallback = fn;
};

WebSocketManager.prototype.onSocketOpen = function(){};

module.exports = WebSocketManager;
