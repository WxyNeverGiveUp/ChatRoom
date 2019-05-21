module.exports = {
    /**
     * Before connection (optional, just for faye)
     * @param {client} client connection
     */
    beforeConnect : function() {
    },

    /**
     * On client connection (required)
     * @param {client} client connection
     * @param {done} callback function(err) {} 
     */ 
    onConnect : function(client: any, done: any) {
        client.emit('newBroadcast', {
            activity: '测试广播',
            content: ''
        })
        client.emit('newBroadcast', {
            activity: '测试广播222',
            content: ''
        })
        done()
    },

    /**
     * Send a message (required)
     * @param {client} client connection
     * @param {done} callback function(err) {} 
     */
    sendMessage : function(client: any, done: any) {
        client.emit('newBroadcast', {
            activity: '测试广播',
            content: ''
        })
        done()
    },

    /**
     * WAMP connection options
     */
    options : {
      // realm: 'chat'
    }
 };