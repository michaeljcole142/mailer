/*
 * A RTMessage represents the real time message for 
 * exchanges via sockets on the server side.
 * It will be responsible for all content integrity except
 * referential integrity with school data. 
 */


class RTMessage {
	
	static messageFuncs=["signin", "sendMessage"];
	
	constructor() {
		this.func=null;
		this.userName=null;
		this.userLocation=null;
		this.toUser=null;
		this.toUserLocation=null;
		this.message=null;
	}

	initialize(message) {
		this.func=message.func;
		this.userName = message.userName;
		this.userLocation = message.userLocation;
		this.toUserName=message.toUserName;
		this.toLocation=message.toLocation;
		this.message=message.message;
		return this.checkIntegrity();
	}
	checkIntegrity() {
		if ( this.func == null ) {
			throw new Error("func not set");
		}
		if ( ! RTMessage.messageFuncs.includes(this.func)) {
			throw new Error("unknown func->" + this.func);
		}
		if ( this.userName == null ) {
			throw new Error("userName is null");
		}
		return true;
	}
}
module.exports = RTMessage;